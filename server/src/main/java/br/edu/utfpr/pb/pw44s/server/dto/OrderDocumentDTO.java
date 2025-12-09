package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.OrderDocument;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class OrderDocumentDTO {

    private Long id;
    private Long orderId;
    private String originalFilename;
    private String contentType;
    private Long size;
    private LocalDateTime uploadDate;

    public OrderDocumentDTO(OrderDocument doc) {
        this.id = doc.getId();
        this.orderId = doc.getOrder().getId();
        this.originalFilename = doc.getOriginalFilename();
        this.contentType = doc.getContentType();
        this.size = doc.getSize();
        this.uploadDate = doc.getUploadDate();
    }
}
