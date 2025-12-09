package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDocumentDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderDocument;
import br.edu.utfpr.pb.pw44s.server.repository.OrderDocumentRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderDocumentService {

    private final OrderRepository orderRepository;
    private final OrderDocumentRepository documentRepository;

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    private Path getOrderDir(Long orderId) {
        return Paths.get(uploadDir, "orders", orderId.toString());
    }

    public OrderDocumentDTO upload(Long orderId, MultipartFile file) throws IOException {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        //!!
        Path dir = getOrderDir(orderId);
        Files.createDirectories(dir);

        String originalName = file.getOriginalFilename();
        String storedName = UUID.randomUUID() + originalName.substring(originalName.lastIndexOf("."));

        Path target = dir.resolve(storedName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        OrderDocument doc = OrderDocument.builder()
                .order(order)
                .filename(storedName)
                .originalFilename(originalName)
                .contentType(file.getContentType())
                .size(file.getSize())
                .uploadDate(LocalDateTime.now())
                .build();

        documentRepository.save(doc);

        return new OrderDocumentDTO(doc);
    }

    public List<OrderDocumentDTO> listByOrder(Long orderId) {
        return documentRepository.findByOrder_Id(orderId).stream()
                .map(OrderDocumentDTO::new)
                .toList();
    }

    public OrderDocument getDocument(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));
    }

    public Resource loadFile(OrderDocument doc) {
        return new FileSystemResource(getOrderDir(doc.getOrder().getId()).resolve(doc.getFilename()));
    }
}