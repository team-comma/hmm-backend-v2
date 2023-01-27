import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  Optional,
  ValidationPipeOptions,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  protected validateCustomDecorators: boolean;

  constructor(@Optional() options?: ValidationPipeOptions) {
    options = options || {};
    const { validateCustomDecorators } = options;
    this.validateCustomDecorators = validateCustomDecorators || false;
  }

  async transform(value, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('데이터를 확인할 수 없어요');
    }

    const { metatype, type } = metadata;
    if (type === 'custom' && !this.validateCustomDecorators) {
      return value;
    }

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);

    const errors = await validate(object, {
      whitelist: true,
      supressUnknownValues: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
    if (errors.length > 0) {
      throw new HttpException(
        {
          message: '데이터 검증이 실패했어요',
          errors: this.buildError(errors),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return object;
  }

  private buildError(errors) {
    const result = [];
    errors.forEach((el) => {
      const { property, value, constraints } = el;
      result.push({
        errorField: property,
        rejectedValue: value ?? null,
        errorDetailMessage: Object.values(constraints),
      });
    });
    return result;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
