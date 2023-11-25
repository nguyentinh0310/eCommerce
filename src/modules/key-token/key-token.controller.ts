import { Controller } from '@nestjs/common';
import { KeyTokenService } from './key-token.service';

@Controller('key-token')
export class KeyTokenController {
  constructor(private readonly keyTokenService: KeyTokenService) {}
}
