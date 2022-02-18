import { Test, TestingModule } from '@nestjs/testing';
import { Empresa } from '../empresa/empresa.entity';
import { Promocoes } from '../promocoes/promocoes.entity';
import { Servicos } from '../servicos/servicos.entity';
import { FindServicosPromocaoQueryDto } from './dto/find-servicos_promocao-dto';
import { ServicoPromocaoDto } from './dto/servicos_promocao-dto';
import { ServicosPromocaoRepository } from './servicos_promocao.repository';
import { ServicosPromocaoService } from './servicos_promocao.service';

const mockServicosPromocaoRepository = () => ({
  findServicosPromocao: jest.fn(),
  findOne: jest.fn(),
  createServicoPromocao: jest.fn(),
  updateServicoPromocao: jest.fn(),
  delete: jest.fn(),
});

describe('ServicosPromocaoService', () => {
  let service: ServicosPromocaoService;
  let servicoPromocaoRepository: ServicosPromocaoRepository;

  const mockServicoPromocaoDto: ServicoPromocaoDto = {
    servico: {
      nome: 'Produto teste',
    } as Servicos,
    precoPromocional: 2.99,
    promocao: {
      id: '5',
    } as Promocoes,
    empresa: { id: '5' } as Empresa,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicosPromocaoService,
        {
          provide: ServicosPromocaoRepository,
          useFactory: mockServicosPromocaoRepository,
        },
      ],
    }).compile();

    servicoPromocaoRepository = await module.get<ServicosPromocaoRepository>(
      ServicosPromocaoRepository,
    );
    service = await module.get<ServicosPromocaoService>(
      ServicosPromocaoService,
    );
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(servicoPromocaoRepository).toBeDefined();
  });

  describe('Criar serviço promoção', () => {
    it('deve criar o serviço promoção', async () => {
      (
        servicoPromocaoRepository.createServicoPromocao as jest.Mock
      ).mockResolvedValue('mockServicoPromocao');
      const result = await service.createServicoPromocao(
        mockServicoPromocaoDto,
      );

      expect(
        servicoPromocaoRepository.createServicoPromocao,
      ).toHaveBeenCalledWith(mockServicoPromocaoDto);
      expect(result).toEqual('mockServicoPromocao');
    });
  });

  describe('Pesquisar serviço promoção', () => {
    it('deve retornar o serviço promoção encontrado', async () => {
      (servicoPromocaoRepository.findOne as jest.Mock).mockResolvedValue(
        'mockServicoPromocao',
      );
      expect(servicoPromocaoRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findServicosPromocaoById(
        'mockIdPromocao',
        'mockIdServico',
      );
      expect(servicoPromocaoRepository.findOne).toHaveBeenCalledWith({
        where: {
          promocao: 'mockIdPromocao',
          servico: 'mockIdServico',
        },
      });
      expect(result).toEqual('mockServicoPromocao');
    });
  });

  describe('Pesquisar serviços promoção', () => {
    it('deve chamar o método findServicosPromocao do servicoPromocaoRepository', async () => {
      (
        servicoPromocaoRepository.findServicosPromocao as jest.Mock
      ).mockResolvedValue('resultOfsearch');
      const mockFindProdutosQueryDto: FindServicosPromocaoQueryDto = {
        promocaoId: 'mockId',
      };

      const result = await service.findServicosPromocao(
        mockFindProdutosQueryDto,
        'mockIdEmpresa',
      );
      expect(
        servicoPromocaoRepository.findServicosPromocao,
      ).toHaveBeenCalledWith(mockFindProdutosQueryDto, 'mockIdEmpresa');
      expect(result).toEqual('resultOfsearch');
    });
  });
});
