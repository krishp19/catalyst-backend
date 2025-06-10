"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '50mb' }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Reddit Clone API')
        .setDescription('API documentation for Reddit Clone application')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addTag('search', 'Search endpoints')
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management endpoints')
        .addTag('posts', 'Post management endpoints')
        .addTag('comments', 'Comment management endpoints')
        .addTag('votes', 'Voting endpoints')
        .addTag('communities', 'Community management endpoints')
        .addServer('https://catalyst-backend-i8ex.onrender.com/api', 'Production Server')
        .addServer('http://localhost:3000/api', 'Local Development Server')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config, {
        deepScanRoutes: true,
        ignoreGlobalPrefix: false,
    });
    const swaggerOptions = {
        explorer: true,
        useGlobalPrefix: true,
        customSiteTitle: 'Reddit Clone API Documentation',
        customCss: `
      .topbar { background-color: #ff4500 !important; }
      .swagger-ui .info .title { color: #ff4500; }
      .scheme-container { display: none !important; } /* Hide server selection */
    `,
        swaggerOptions: {
            url: '/api/docs-json',
            persistAuthorization: true,
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true,
            defaultModelsExpandDepth: -1,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
            validatorUrl: null,
            supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
            requestInterceptor: (req) => {
                if (req.url && req.url.startsWith('http://') && process.env.NODE_ENV === 'production') {
                    req.url = req.url.replace('http://', 'https://');
                }
                return req;
            },
        },
    };
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    app.use('/api/docs', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        next();
    });
    swagger_1.SwaggerModule.setup('api/docs', app, document, swaggerOptions);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map