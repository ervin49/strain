package com.fitnesslab.strain.service;

import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ImageService {
    private UserRepository userRepository;

    private void validateImage(MultipartFile file){
        if(file.isEmpty()){
            throw new IllegalArgumentException("No file received");
        }
        if(file.getSize() > 2 * 1024 * 1024){
            throw new IllegalArgumentException("Image is too large");
        }
        String contentType = file.getContentType();
        if(!List.of("image/jpeg","image/png","image/webp").contains(contentType)){
            throw new IllegalArgumentException("File is not an image");
        }

        try(InputStream in = file.getInputStream()){
            BufferedImage image = ImageIO.read(in);
            if(image == null){
                throw new IllegalArgumentException("File is not a valid image");
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not read file");
        }
    }

    public void storeImage(MultipartFile file, String email){
        validateImage(file);

        String extension = switch (Objects.requireNonNullElse(file.getContentType(),"")){
            case "image/png"  -> "png";
            case "image/webp" -> "webp";
            default           -> "jpg";
        };

        String filename = UUID.randomUUID() + "." + extension;

        String rootDir = new FileSystemResource("").getFile().getAbsolutePath();
        Path uploadDir = Paths.get(rootDir, "user-images");
        Path fullPath = uploadDir.resolve(filename);

        try {
            Files.createDirectories(uploadDir);
            file.transferTo(fullPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not store image",e);
        }

        User user = userRepository.getUserByEmail(email).orElseThrow();
        user.setAvatarPath(fullPath.toString());
    }

    public byte[] downloadImage(String email) throws IOException {
        User user = userRepository.getUserByEmail(email).orElseThrow();
        return Files.readAllBytes(new File(user.getAvatarPath()).toPath());
    }

    public String getContentTypeOfAvatar(String email) {
        String avatarPath = userRepository.getUserByEmail(email).orElseThrow().getAvatarPath();
        return "image/" + avatarPath.split("\\.")[1];
    }
}
