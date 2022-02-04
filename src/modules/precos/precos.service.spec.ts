import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePrecosDto } from './dto/create-precos-dto';
import { PrecosRepository } from './precos.repository';
import { PrecosService } from './precos.service';

const mockPrecosRepository = () => ({
  createPrecos: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('PrecosService', () => {
  let service: PrecosService;
  let precosRepository: PrecosRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrecosService,
        {
          provide: PrecosRepository,
          useFactory: mockPrecosRepository,
        },
      ],
    }).compile();

    precosRepository = await module.get<PrecosRepository>(PrecosRepository);
    service = await module.get<PrecosService>(PrecosService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(precosRepository).toBeDefined();
  });

  describe('Criar ou atualizar precos', () => {
    let mockPrecosDto: CreatePrecosDto;

    beforeEach(() => {
      mockPrecosDto = {
        precoVendaVarejo: 4.0,
        precoVendaAtacado: 2.0,
        precoCompra: 1.0,
        margemLucro: 3.0,
      };
    });

    it('deve criar o preço', async () => {
      (precosRepository.createPrecos as jest.Mock).mockResolvedValue(
        'mockPreco',
      );
      const result = await service.updateOrCreatePrecos(mockPrecosDto, null);

      expect(precosRepository.createPrecos).toHaveBeenCalledWith(mockPrecosDto);
      expect(result).toEqual('mockPreco');
    });

    it('deve atualizar o preço', async () => {
      (precosRepository.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });
      (precosRepository.findOne as jest.Mock).mockResolvedValue('mockPreco');

      const result = await service.updateOrCreatePrecos(
        mockPrecosDto,
        'mockId',
      );

      expect(precosRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        mockPrecosDto,
      );
      expect(result).toEqual('mockPreco');
    });
  });

  describe('Pesquisar preço', () => {
    it('deve retornar o preço encontrado', async () => {
      (precosRepository.findOne as jest.Mock).mockResolvedValue('mockPreco');
      expect(precosRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findPrecoById('mockId');
      expect(precosRepository.findOne).toHaveBeenCalledWith('mockId');
      expect(result).toEqual('mockPreco');
    });

    it('deve lançar um erro porque o preço não foi encontrado', async () => {
      (precosRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.findPrecoById('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Deletar preço', () => {
    it('deve retornar afetado > 0 se o preço for excluído', async () => {
      (precosRepository.findOne as jest.Mock).mockResolvedValue('mockPreco');
      expect(precosRepository.findOne).not.toHaveBeenCalled();

      (precosRepository.delete as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      await service.deletePreco('mockId');
      expect(precosRepository.delete).toHaveBeenCalledWith({ id: 'mockId' });
    });

    it('deve lançar um erro se nenhum preço for excluído', async () => {
      (precosRepository.delete as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(service.deletePreco('mockId')).rejects.toThrow(NotFoundException);
    });
  });
});
