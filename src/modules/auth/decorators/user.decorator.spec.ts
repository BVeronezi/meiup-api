import { User } from './user.decorator';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { getParamDecoratorFactory } from '../../../../jest.setup';

describe('UserDecorator', function () {
  it('Deve chamar o decorator', function () {
    const factory = getParamDecoratorFactory(User);
    const mock = createMock<ExecutionContext>();
    jest.spyOn(mock, 'switchToHttp').mockReturnValue({
      ...createMock<HttpArgumentsHost>(),
      getRequest: jest.fn().mockReturnValue({
        user: 'mocked',
      }),
    });
    const result = factory(null, mock);
    expect(result).toBe('mocked');
  });
});
