import 'reflect-metadata';

import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
export function getParamDecoratorFactory(decorator) {
  class Test {
    public test(@decorator() value) {
      return value;
    }
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return args[Object.keys(args)[0]].factory;
}
