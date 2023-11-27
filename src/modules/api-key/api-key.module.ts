import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ApiKey, ApiKeySchema } from "./api-key.schema";
import { ApiKeyService } from "./api-key.service";
import { ApiKeyRepository } from "./api-key.repository";


@Module({
    imports: [MongooseModule.forFeature([
        {name: ApiKey.name, schema: ApiKeySchema}
    ])],
    controllers:[],
    providers: [ApiKeyService, ApiKeyRepository],
    exports: [ApiKeyService]
})

export class ApiKeyModule {}