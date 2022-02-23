import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Empresa } from '../empresa/empresa.entity';
import { CategoriasRepository } from './categorias.repository';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria-dto';
import { FindCategoriasQueryDto } from './dto/find-categorias-query-dto';
import { UpdateCategoriaDto } from './dto/update-categoria-dto';

const mockCategoriaRepository = () => ({
  findOne: jest.fn(),
  findCategorias: jest.fn(),
  createCategoria: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('CategoriasService', () => {
  let service: CategoriasService;
  let categoriaRepository: CategoriasRepository;

  const mockEmpresa = { id: '5' } as Empresa;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        {
          provide: CategoriasRepository,
          useFactory: mockCategoriaRepository,
        },
      ],
    }).compile();

    categoriaRepository = await module.get<CategoriasRepository>(
      CategoriasRepository,
    );
    service = await module.get<CategoriasService>(CategoriasService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(categoriaRepository).toBeDefined();
  });

  describe('Criar categoria', () => {
    let mockCreateCategoriaDto: CreateCategoriaDto;

    beforeEach(() => {
      mockCreateCategoriaDto = {
        nome: 'categoria',
        empresa: mockEmpresa,
      };
    });

    it('deve criar a categoria', async () => {
      (categoriaRepository.createCategoria as jest.Mock).mockResolvedValue(
        'mockCategoria',
      );
      const result = await service.createCategoria(
        mockCreateCategoriaDto,
        mockEmpresa,
      );

      expect(categoriaRepository.createCategoria).toHaveBeenCalledWith(
        mockCreateCategoriaDto,
        mockEmpresa,
      );
      expect(result).toEqual('mockCategoria');
    });
  });

  describe('Pesquisar categoria', () => {
    it('deve retornar a categoria encontrada', async () => {
      (categoriaRepository.findOne as jest.Mock).mockResolvedValue(
        'mockCategoria',
      );
      expect(categoriaRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findCategoriaById('mockId');
      expect(categoriaRepository.findOne).toHaveBeenCalledWith('mockId');
      expect(result).toEqual('mockCategoria');
    });

    it('deve lançar um erro porque a categoria não foi encontrada', async () => {
      (categoriaRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.findCategoriaById('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Pesquisar categorias', () => {
    it('deve chamar o método findCategorias da categoriaRepository', async () => {
      (categoriaRepository.findCategorias as jest.Mock).mockResolvedValue(
        'resultOfsearch',
      );

      const mockFindCategoriaQueryDto: FindCategoriasQueryDto = {
        nome: 'categoria',
      };

      const result = await service.findCategorias(
        mockFindCategoriaQueryDto,
        'mockIdEmpresa',
      );
      expect(categoriaRepository.findCategorias).toHaveBeenCalledWith(
        mockFindCategoriaQueryDto,
        'mockIdEmpresa',
      );
      expect(result).toEqual('resultOfsearch');
    });
  });

  describe('Atualizar categoria', () => {
    let mockUpdateCategoriaDto: UpdateCategoriaDto;

    beforeEach(() => {
      mockUpdateCategoriaDto = {
        nome: 'Categoria Teste',
      };
    });

    it('deve retornar afetado > 0 se os dados da categoria forem atualizados e retornar os novos dados', async () => {
      (categoriaRepository.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });
      (categoriaRepository.findOne as jest.Mock).mockResolvedValue(
        'mockCategoria',
      );

      const result = await service.updateCategoria(
        mockUpdateCategoriaDto,
        'mockId',
      );

      expect(categoriaRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        mockUpdateCategoriaDto,
      );
      expect(result).toEqual('mockCategoria');
    });

    it('deve lançar um erro se nenhuma linha for afetada no banco de dados', async () => {
      (categoriaRepository.update as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(
        service.updateCategoria(mockUpdateCategoriaDto, 'mockId'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Deletar categoria', () => {
    it('deve retornar afetado > 0 se a categoria for excluída', async () => {
      (categoriaRepository.findOne as jest.Mock).mockResolvedValue(
        'mockCategoria',
      );
      expect(categoriaRepository.findOne).not.toHaveBeenCalled();

      (categoriaRepository.delete as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      await service.deleteCategoria('mockId');
      expect(categoriaRepository.delete).toHaveBeenCalledWith({ id: 'mockId' });
    });

    it('deve lançar um erro se nenhuma categoria for excluída', async () => {
      (categoriaRepository.delete as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(service.deleteCategoria('mockId')).rejects.toThrow(Error);
    });
  });
});
