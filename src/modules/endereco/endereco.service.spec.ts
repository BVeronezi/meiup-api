import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Empresa } from '../empresa/empresa.entity';
import { Endereco } from '../endereco/endereco.entity';
import { EnderecoService } from '../endereco/endereco.service';
import { Usuario } from '../usuario/usuario.entity';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { EnderecoRepository } from './endereco.repository';

const mockEnderecoRepository = () => ({
  findOne: jest.fn(),
  createEndereco: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('EnderecoService', () => {
  let service: EnderecoService;
  let enderecoRepository: EnderecoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnderecoService,
        {
          provide: EnderecoRepository,
          useFactory: mockEnderecoRepository,
        },
      ],
    }).compile();

    enderecoRepository = await module.get<EnderecoRepository>(
      EnderecoRepository,
    );
    service = await module.get<EnderecoService>(EnderecoService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(enderecoRepository).toBeDefined();
  });

  describe('Criar ou atualizar endereco', () => {
    let mockEnderecoDto: CreateEnderecoDto;

    beforeEach(() => {
      mockEnderecoDto = {
        cep: 'mockCep',
        endereco: 'mockEndereco',
        estado: 'mockEstado',
        numero: 'mockNumero',
        bairro: 'mockBairro',
        cidade: 'mockCidade',
        complemento: 'mockComplemento',
      };
    });

    it('deve criar o endereco', async () => {
      (enderecoRepository.createEndereco as jest.Mock).mockResolvedValue(
        'mockEndereco',
      );
      const result = await service.updateOrCreateEndereco(
        mockEnderecoDto,
        null,
      );

      expect(enderecoRepository.createEndereco).toHaveBeenCalledWith(
        mockEnderecoDto,
      );
      expect(result).toEqual('mockEndereco');
    });

    it('deve atualizar o endereco', async () => {
      (enderecoRepository.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });
      (enderecoRepository.findOne as jest.Mock).mockResolvedValue(
        'mockEndereco',
      );

      const result = await service.updateOrCreateEndereco(
        mockEnderecoDto,
        'mockId',
      );

      expect(enderecoRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        mockEnderecoDto,
      );
      expect(result).toEqual('mockEndereco');
    });
  });

  describe('Pesquisar endere??o', () => {
    it('deve retornar o endere??o encontrado', async () => {
      (enderecoRepository.findOne as jest.Mock).mockResolvedValue(
        'mockEndereco',
      );
      expect(enderecoRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findEnderecoById('mockId');
      expect(enderecoRepository.findOne).toHaveBeenCalledWith('mockId');
      expect(result).toEqual('mockEndereco');
    });

    it('deve lan??ar um erro porque o endere??o n??o foi encontrado', async () => {
      (enderecoRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.findEnderecoById('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Deletar endere??o', () => {
    it('deve retornar afetado > 0 se o endere??o for exclu??do', async () => {
      (enderecoRepository.findOne as jest.Mock).mockResolvedValue(
        'mockEndereco',
      );
      expect(enderecoRepository.findOne).not.toHaveBeenCalled();

      (enderecoRepository.delete as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      await service.deleteEndereco('mockId');
      expect(enderecoRepository.delete).toHaveBeenCalledWith({ id: 'mockId' });
    });

    it('deve lan??ar um erro se nenhum endere??o for exclu??do', async () => {
      (enderecoRepository.delete as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(service.deleteEndereco('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
