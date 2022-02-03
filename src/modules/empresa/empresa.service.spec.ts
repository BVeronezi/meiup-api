import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Endereco } from '../endereco/endereco.entity';
import { EnderecoService } from '../endereco/endereco.service';
import { CreateEmpresaDto } from './dto/create-empresa-dto';
import { EmpresaRepository } from './empresa.repository';
import { EmpresaService } from './empresa.service';

const mockEmpresaRepository = () => ({
  createCompany: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
});

describe('EmpresaService', () => {
  let service: EmpresaService;
  let empresaRepository: EmpresaRepository;

  const fakeEnderecoService: Partial<EnderecoService> = {
    updateOrCreateEndereco: () =>
      Promise.resolve({
        cep: '',
        endereco: '',
        estado: '',
        numero: '',
        bairro: '',
        cidade: '',
        complemento: '',
      } as Endereco),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmpresaService,
        {
          provide: EmpresaRepository,
          useFactory: mockEmpresaRepository,
        },
        {
          provide: EnderecoService,
          useValue: fakeEnderecoService,
        },
      ],
    }).compile();

    empresaRepository = await module.get<EmpresaRepository>(EmpresaRepository);
    service = await module.get<EmpresaService>(EmpresaService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(empresaRepository).toBeDefined();
  });

  describe('Criar empresa', () => {
    let mockCreateEmpresaDto: CreateEmpresaDto;

    beforeEach(() => {
      mockCreateEmpresaDto = {
        email: 'mock@email.com',
        cnpj: '00154193000135',
        telefone: 31994411234,
        celular: 3130161234,
      };
    });

    it('deve criar a empresa', async () => {
      (empresaRepository.createCompany as jest.Mock).mockResolvedValue(
        'mockEmpresa',
      );
      const result = await service.createCompany(mockCreateEmpresaDto);

      expect(empresaRepository.createCompany).toHaveBeenCalledWith(
        mockCreateEmpresaDto,
      );
      expect(result).toEqual('mockEmpresa');
    });
  });

  describe('Pesquisar empresa', () => {
    it('deve retornar a empresa encontrada', async () => {
      (empresaRepository.findOne as jest.Mock).mockResolvedValue('mockEmpresa');
      expect(empresaRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findEmpresaById('mockId');
      const relations = ['endereco'];
      expect(empresaRepository.findOne).toHaveBeenCalledWith('mockId', {
        relations,
      });
      expect(result).toEqual('mockEmpresa');
    });

    it('deve lançar um erro porque a empresa não foi encontrada', async () => {
      (empresaRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.findEmpresaById('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Atualizar empresa', () => {
    let mockUpdateEmpresaDto: any;

    beforeEach(() => {
      mockUpdateEmpresaDto = {
        razaoSocial: 'TAS COMERCIO DE TERRAPLANAGEM LTDA',
        email: 'mock@email.com',
        cnpj: '00154193000135',
        telefone: 31994411234,
        celular: 3130161234,
        ie: 0,
      };
    });

    it('deve retornar afetado > 0 se os dados da empresa forem atualizados e retornar a nova empresa', async () => {
      (empresaRepository.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });
      (empresaRepository.findOne as jest.Mock).mockResolvedValue('mockEmpresa');

      const result = await service.updateCompany(
        mockUpdateEmpresaDto,
        'mockId',
      );
      expect(empresaRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        mockUpdateEmpresaDto,
      );
      expect(result).toEqual('mockEmpresa');
    });

    it('deve lançar um erro se nenhuma linha for afetada no banco de dados', async () => {
      (empresaRepository.update as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(
        service.updateCompany(mockUpdateEmpresaDto, 'mockId'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
