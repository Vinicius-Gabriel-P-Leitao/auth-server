package com.auth.infra.security.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Configure global static resource handling for the Single Page Application (React/Tanstack).
 * Defers any non-API request mapping to the React Router.
 */
@Configuration
public class SpaWebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        
                        // 1. If the exact file exists (e.g. /assets/index-xyz.js), return it.
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        
                        // 2. If it is an API call passing by mistake, allow it to 404 naturally.
                        if (resourcePath.startsWith("v1/") || resourcePath.startsWith("swagger-ui/") || resourcePath.startsWith("v3/")) {
                            return null;
                        }

                        // 3. Otherwise, it's a deep-linked SPA route (e.g. /login). Return index.html.
                        return new ClassPathResource("/static/index.html");
                    }
                });
    }
}
