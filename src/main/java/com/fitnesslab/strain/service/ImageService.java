package com.fitnesslab.strain.service;

import com.fitnesslab.strain.model.entity.User;
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
public class ImageService {
    private void validateImage(MultipartFile file){
        if(file.isEmpty()){
            throw new IllegalArgumentException("No file received");
        }
        if(file.getSize() > 10 * 1024 * 1024){
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

    public void storeImage(MultipartFile file, User user){
        validateImage(file);

        String extension = switch (Objects.requireNonNullElse(file.getContentType(),"")){
            case "image/png"  -> "png";
            case "image/webp" -> "webp";
            default           -> "jpg";
        };

        String filename = UUID.randomUUID() + "." + extension;

        Path uploadDir = getUploadDir();
        Path fullPath = uploadDir.resolve(filename);

        try {
            Files.createDirectories(uploadDir);
            file.transferTo(fullPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not store image",e);
        }

        String previousAvatarPath = user.getAvatarPath();
        user.setAvatarPath(filename);
        deletePreviousAvatar(uploadDir, previousAvatarPath, filename);
    }


    public void deleteAvatarFromFileSystem(User user){
        String avatarPath = user.getAvatarPath();
        if (avatarPath == null || avatarPath.isBlank()) {
            user.setAvatarPath(null);
            return;
        }

        Path fullPath = resolveAvatarPath(getUploadDir(), avatarPath);

        try{
            Files.deleteIfExists(fullPath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        user.setAvatarPath(null);
    }

    private void deletePreviousAvatar(Path uploadDir, String previousAvatarPath, String newFilename) {
        if (previousAvatarPath == null || previousAvatarPath.isBlank() || previousAvatarPath.equals(newFilename)) {
            return;
        }

        try {
            Files.deleteIfExists(resolveAvatarPath(uploadDir, previousAvatarPath));
        } catch (IOException e) {
            throw new RuntimeException("Could not delete previous profile picture", e);
        }
    }

    private Path getUploadDir() {
        return Paths.get("").toAbsolutePath().resolve("user-images")
                .toAbsolutePath()
                .normalize();
    }

    private Path resolveAvatarPath(Path uploadDir, String filename) {
        Path normalizedUploadDir = uploadDir.toAbsolutePath().normalize();
        Path path = normalizedUploadDir.resolve(filename).normalize();
        if (!path.startsWith(normalizedUploadDir)) {
            throw new IllegalArgumentException("Invalid profile picture path");
        }
        return path;
    }
}
