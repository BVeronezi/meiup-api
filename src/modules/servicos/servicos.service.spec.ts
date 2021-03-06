import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Empresa } from '../empresa/empresa.entity';
import { ProdutosService } from '../produtos/produtos.service';
import { ProdutosServicoService } from '../produtos_servico/produtos_servico.service';
import { CreateServicosDto } from './dto/create-servicos-dto';
import { FindServicosQueryDto } from './dto/find-servicos-query-dto';
import { UpdateServicosDto } from './dto/update-servicos-dto';
import { ServicosRepository } from './servicos.repository';
import { ServicosService } from './servicos.service';

const mockServicoRepository = () => ({
  createServico: jest.fn(),
  findOne: jest.fn(),
  findServicos: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ServicosService', () => {
  let service: ServicosService;
  let servicoRepository: ServicosRepository;

  const mockEmpresa = { id: '5' } as Empresa;

  const fakeProdutosService: Partial<ProdutosService> = {
    findProdutoById: jest.fn(),
  };

  const fakeProdutoServicoService: Partial<ProdutosServicoService> = {
    createProdutoServico: jest.fn(),
    updateProdutoServico: jest.fn(),
    findProdutosServicoById: jest.fn(),
    findProdutosServico: jest.fn(),
    deleteProdutoServico: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicosService,
        {
          provide: ServicosRepository,
          useFactory: mockServicoRepository,
        },
        {
          provide: ProdutosService,
          useValue: fakeProdutosService,
        },
        {
          provide: ProdutosServicoService,
          useValue: fakeProdutoServicoService,
        },
      ],
    }).compile();

    servicoRepository = await module.get<ServicosRepository>(
      ServicosRepository,
    );
    service = await module.get<ServicosService>(ServicosService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(servicoRepository).toBeDefined();
  });

  describe('Criar servi??o', () => {
    let mockCreateServicoDto: CreateServicosDto;

    beforeEach(() => {
      mockCreateServicoDto = {
        nome: 'Servi??o teste',
        empresa: mockEmpresa,
      };
    });

    it('deve criar o servi??o', async () => {
      (servicoRepository.createServico as jest.Mock).mockResolvedValue(
        'mockServico',
      );
      const result = await service.createServico(
        mockCreateServicoDto,
        mockEmpresa,
      );

      expect(servicoRepository.createServico).toHaveBeenCalledWith(
        mockCreateServicoDto,
        mockEmpresa,
      );
      expect(result).toEqual('mockServico');
    });
  });

  describe('Pesquisar servi??o', () => {
    it('deve retornar o servi??o encontrado', async () => {
      (servicoRepository.findOne as jest.Mock).mockResolvedValue('mockServico');
      expect(servicoRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findServicoById('mockId');
      expect(servicoRepository.findOne).toHaveBeenCalledWith('mockId');
      expect(result).toEqual('mockServico');
    });

    it('deve lan??ar um erro porque o servi??o n??o foi encontrado', async () => {
      (servicoRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.findServicoById('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Pesquisar servi??os', () => {
    it('deve chamar o m??todo findServicos do servicoRepository', async () => {
      (servicoRepository.findServicos as jest.Mock).mockResolvedValue(
        'resultOfsearch',
      );
      const mockFindServicosQueryDto: FindServicosQueryDto = {
        nome: 'Servi??o Teste',
      };

      const result = await service.findServicos(
        mockFindServicosQueryDto,
        'mockIdEmpresa',
      );
      expect(servicoRepository.findServicos).toHaveBeenCalledWith(
        mockFindServicosQueryDto,
        'mockIdEmpresa',
      );
      expect(result).toEqual('resultOfsearch');
    });
  });

  describe('Atualizar servi??o', () => {
    let mockUpdateServicoDto: UpdateServicosDto;

    beforeEach(() => {
      mockUpdateServicoDto = {
        nome: 'Servi??o teste 2',
      };
    });

    it('deve retornar afetado > 0 se os dados do servi??o forem atualizados e retornar os novos dados', async () => {
      (servicoRepository.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });
      (servicoRepository.findOne as jest.Mock).mockResolvedValue('mockServico');

      const result = await service.updateServico(
        mockUpdateServicoDto,
        'mockId',
      );

      expect(servicoRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        mockUpdateServicoDto,
      );

      expect(result).toEqual('mockServico');
    });

    it('deve lan??ar um erro se nenhuma linha for afetada no banco de dados', async () => {
      (servicoRepository.update as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(
        service.updateServico(mockUpdateServicoDto, 'mockId'),
      ).rejects.toThrow(Error);
    });
  });
});
