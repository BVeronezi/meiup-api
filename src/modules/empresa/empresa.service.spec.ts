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

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(empresaRepository).toBeDefined();
  });

  describe('createUser', () => {
    let mockCreateEmpresaDto: CreateEmpresaDto;

    beforeEach(() => {
      mockCreateEmpresaDto = {
        email: 'mock@email.com',
        cnpj: '00154193000135',
        telefone: 31994411234,
        celular: 3130161234,
      };
    });

    it('should create an user if passwords match', async () => {
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

  describe('findUserById', () => {
    it('should return the found user', async () => {
      (empresaRepository.findOne as jest.Mock).mockResolvedValue('mockEmpresa');
      expect(empresaRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findEmpresaById('mockId');
      const relations = ['endereco'];
      expect(empresaRepository.findOne).toHaveBeenCalledWith('mockId', {
        relations,
      });
      expect(result).toEqual('mockEmpresa');
    });

    it('should throw an error as user is not found', async () => {
      (empresaRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.findEmpresaById('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
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

    it('should return affected > 0 if user data is updated and return the new user', async () => {
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

    it('should throw an error if no row is affected in the DB', async () => {
      (empresaRepository.update as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(
        service.updateCompany(mockUpdateEmpresaDto, 'mockId'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
