package br.edu.utfpr.pb.pw44s.server.config;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderStatusHistoryDTO;
import br.edu.utfpr.pb.pw44s.server.model.*;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import org.modelmapper.AbstractConverter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

@Configuration
public class ModelMapperConfig {

    private final ProductRepository productRepository;

    public ModelMapperConfig(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        modelMapper.addConverter(new AbstractConverter<Long, Product>() {
            @Override
            protected Product convert(Long productId) {
                if (productId == null) return null;
                Optional<Product> productOptional = productRepository.findById(productId);
                return productOptional.orElse(null);
            }
        });


        TypeMap<Order, OrderDTO> orderToDto = modelMapper.createTypeMap(Order.class, OrderDTO.class);

        orderToDto.addMappings(mapper -> {
            mapper.map(src -> src.getUser().getId(), OrderDTO::setUserId);

            mapper.map(Order::getPaymentMethodType, OrderDTO::setPaymentMethodType);
            mapper.map(Order::getPaymentMethodDetails, OrderDTO::setPaymentMethodDetails);

            mapper.map(Order::getShippingAddressStreet, OrderDTO::setShippingAddressStreet);
            mapper.map(Order::getShippingAddressNumber, OrderDTO::setShippingAddressNumber);
            mapper.map(Order::getShippingAddressComplement, OrderDTO::setShippingAddressComplement);
            mapper.map(Order::getShippingAddressNeighborhood, OrderDTO::setShippingAddressNeighborhood);
            mapper.map(Order::getShippingAddressCity, OrderDTO::setShippingAddressCity);
            mapper.map(Order::getShippingAddressState, OrderDTO::setShippingAddressState);
            mapper.map(Order::getShippingAddressZipCode, OrderDTO::setShippingAddressZipCode);


            mapper.map(Order::getHistory, OrderDTO::setHistory);
        });


        TypeMap<OrderDTO, Order> dtoToOrder = modelMapper.createTypeMap(OrderDTO.class, Order.class);

        dtoToOrder.addMappings(mapper -> {
            mapper.map(OrderDTO::getPaymentMethodType, Order::setPaymentMethodType);
            mapper.map(OrderDTO::getPaymentMethodDetails, Order::setPaymentMethodDetails);

            mapper.map(OrderDTO::getShippingAddressStreet, Order::setShippingAddressStreet);
            mapper.map(OrderDTO::getShippingAddressNumber, Order::setShippingAddressNumber);
            mapper.map(OrderDTO::getShippingAddressComplement, Order::setShippingAddressComplement);
            mapper.map(OrderDTO::getShippingAddressNeighborhood, Order::setShippingAddressNeighborhood);
            mapper.map(OrderDTO::getShippingAddressCity, Order::setShippingAddressCity);
            mapper.map(OrderDTO::getShippingAddressState, Order::setShippingAddressState);
            mapper.map(OrderDTO::getShippingAddressZipCode, Order::setShippingAddressZipCode);

            mapper.map(OrderDTO::getItems, Order::setItems);

            mapper.skip(Order::setUser);
            mapper.skip(Order::setHistory);
        });


        modelMapper.createTypeMap(OrderItemDTO.class, OrderItem.class).addMappings(mapper -> {
            mapper.map(OrderItemDTO::getId, OrderItem::setId);
            mapper.map(OrderItemDTO::getQuantity, OrderItem::setQuantity);
            mapper.map(OrderItemDTO::getPrice, OrderItem::setUnitPrice);
            mapper.map(OrderItemDTO::getProductName, OrderItem::setProductName);
            mapper.map(OrderItemDTO::getProductImageUrl, OrderItem::setProductImageUrl);
            mapper.map(OrderItemDTO::getProductId, OrderItem::setProduct);
            mapper.skip(OrderItem::setOrder);
        });


        modelMapper.createTypeMap(OrderItem.class, OrderItemDTO.class).addMappings(mapper -> {
            mapper.map(src -> src.getProduct().getId(), OrderItemDTO::setProductId);
            mapper.map(OrderItem::getQuantity, OrderItemDTO::setQuantity);
            mapper.map(OrderItem::getUnitPrice, OrderItemDTO::setPrice);
            mapper.map(OrderItem::getProductName, OrderItemDTO::setProductName);
            mapper.map(OrderItem::getProductImageUrl, OrderItemDTO::setProductImageUrl);
        });


        modelMapper.createTypeMap(OrderStatusHistory.class, OrderStatusHistoryDTO.class).addMappings(mapper -> {
            mapper.map(OrderStatusHistory::getPreviousStatus, OrderStatusHistoryDTO::setPreviousStatus);
            mapper.map(OrderStatusHistory::getNewStatus, OrderStatusHistoryDTO::setNewStatus);
            mapper.map(OrderStatusHistory::getChangedAt, OrderStatusHistoryDTO::setChangedAt);
            mapper.map(OrderStatusHistory::getChangedBy, OrderStatusHistoryDTO::setChangedBy);
        });

        return modelMapper;
    }
}
