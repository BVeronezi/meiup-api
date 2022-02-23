import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Empresa } from '../empresa/empresa.entity';
import { ProdutosService } from '../produtos/produtos.service';
import { ProdutosPromocaoService } from '../produtos_promocao/produtos_promocao.service';
import { ServicosService } from '../servicos/servicos.service';
import { ServicosPromocaoService } from '../servicos_promocao/servicos_promocao.service';
import { CreatePromocaoDto } from './dto/create-promocoes-dto';
import { FindPromocoesQueryDto } from './dto/find-promocoes-query-dto';
import { UpdatePromocaoDto } from './dto/update-promocao-dto';
import { PromocoesRepository } from './promocoes.repository';
import { PromocoesService } from './promocoes.service';

const mockPromocaoRepository = () => ({
  createPromocao: jest.fn(),
  findPromocoes: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('PromocoesService', () => {
  let service: PromocoesService;
  let promocaoRepository: PromocoesRepository;

  const empresa = { id: '5' } as Empresa;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromocoesService,
        {
          provide: PromocoesRepository,
          useFactory: mockPromocaoRepository,
        },
        {
          provide: ProdutosPromocaoService,
          useValue: createMock<ProdutosPromocaoService>(),
        },
        {
          provide: ServicosPromocaoService,
          useValue: createMock<ServicosPromocaoService>(),
        },
        {
          provide: ServicosService,
          useValue: createMock<ServicosService>(),
        },
        {
          provide: ProdutosService,
          useValue: createMock<ProdutosService>(),
        },
      ],
    }).compile();

    promocaoRepository = await module.get<PromocoesRepository>(
      PromocoesRepository,
    );
    service = await module.get<PromocoesService>(PromocoesService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(promocaoRepository).toBeDefined();
  });

  describe('Criar promoção', () => {
    let mockCreatePromocaoDto: CreatePromocaoDto;

    beforeEach(() => {
      mockCreatePromocaoDto = {
        descricao: 'Promoção teste',
        produtos: [{ id: 1, descricao: 'Produto Teste' }],
        dataInicio: new Date(),
        dataFim: new Date(),
        empresa,
      };
    });

    it('deve criar o promoção', async () => {
      (promocaoRepository.createPromocao as jest.Mock).mockResolvedValue(
        'mockPromocao',
      );
      const result = await service.createPromocao(
        mockCreatePromocaoDto,
        empresa,
      );

      expect(promocaoRepository.createPromocao).toHaveBeenCalledWith(
        mockCreatePromocaoDto,
        empresa,
      );
      expect(result).toEqual('mockPromocao');
    });
  });

  describe('Pesquisar promoção', () => {
    it('deve retornar o promoção encontrado', async () => {
      (promocaoRepository.findOne as jest.Mock).mockResolvedValue(
        'mockPromocao',
      );
      expect(promocaoRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findPromocaoById('mockId');
      expect(promocaoRepository.findOne).toHaveBeenCalledWith('mockId');
      expect(result).toEqual('mockPromocao');
    });

    it('deve lançar um erro porque a promoção não foi encontrada', async () => {
      (promocaoRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.findPromocaoById('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Pesquisar promoções', () => {
    it('deve chamar o método findPromocoes do promocaoRepository', async () => {
      (promocaoRepository.findPromocoes as jest.Mock).mockResolvedValue(
        'resultOfsearch',
      );
      const mockFindPromocoesQueryDto: FindPromocoesQueryDto = {
        descricao: 'Promoção teste',
      };

      const result = await service.findPromocoes(
        mockFindPromocoesQueryDto,
        'mockIdEmpresa',
      );
      expect(promocaoRepository.findPromocoes).toHaveBeenCalledWith(
        mockFindPromocoesQueryDto,
        'mockIdEmpresa',
      );
      expect(result).toEqual('resultOfsearch');
    });
  });

  describe('Atualizar promoção', () => {
    let mockUpdatePromocaoDto: UpdatePromocaoDto;

    beforeEach(() => {
      mockUpdatePromocaoDto = {
        descricao: 'Promoção teste 2',
        dataInicio: undefined,
        dataFim: undefined,
      };
    });

    it('deve retornar afetado > 0 se os dados da promoção forem atualizados e retornar os novos dados', async () => {
      (promocaoRepository.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });
      (promocaoRepository.findOne as jest.Mock).mockResolvedValue(
        'mockPromocao',
      );

      const result = await service.updatePromocao(
        mockUpdatePromocaoDto,
        'mockId',
      );

      expect(promocaoRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        mockUpdatePromocaoDto,
      );
      expect(result).toEqual('mockPromocao');
    });

    it('deve lançar um erro se nenhuma linha for afetada no banco de dados', async () => {
      (promocaoRepository.update as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(
        service.updatePromocao(mockUpdatePromocaoDto, 'mockId'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Deletar promoção', () => {
    it('deve retornar afetado > 0 se a promoção for excluída', async () => {
      (promocaoRepository.findOne as jest.Mock).mockResolvedValue(
        'mockPromocao',
      );
      expect(promocaoRepository.findOne).not.toHaveBeenCalled();

      (promocaoRepository.delete as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      await service.deletePromocao('mockId', 'mockIdEmpresa');
      expect(promocaoRepository.delete).toHaveBeenCalledWith({ id: 'mockId' });
    });

    it('deve lançar um erro se nenhuma promoção for excluída', async () => {
      (promocaoRepository.delete as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(service.deletePromocao('mockId', 'mockIdEmpresa')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
