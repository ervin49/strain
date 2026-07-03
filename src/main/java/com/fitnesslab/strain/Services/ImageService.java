package com.fitnesslab.strain.Services;

import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
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

        Path uploadDir = Paths.get("user-images");
        Path fullPath = uploadDir.resolve(filename);

        try {
            Files.createDirectories(uploadDir);
            file.transferTo(fullPath.toFile());
        } catch (IOException e) {
            throw new RuntimeException("Could not store image",e);
        }

        User user = userRepository.getUserByEmail(email).orElseThrow();
        user.setAvatarPath(filename);
    }
}
