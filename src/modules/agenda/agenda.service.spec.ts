import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Empresa } from '../empresa/empresa.entity';
import { Endereco } from '../endereco/endereco.entity';
import { EnderecoService } from '../endereco/endereco.service';
import { Usuario } from '../usuario/usuario.entity';
import { AgendaRepository } from './agenda.repository';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda-dto';
import { FindAgendaQueryDto } from './dto/find-agenda-query-dto';
import { UpdateAgendaDto } from './dto/update-agenda-dto';

const mockAgendaRepository = () => ({
  createAgenda: jest.fn(),
  findAgenda: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('AgendaService', () => {
  let service: AgendaService;
  let agendaRepository: AgendaRepository;

  const mockUsuario = { id: 'mockId' } as Usuario;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgendaService,
        {
          provide: AgendaRepository,
          useFactory: mockAgendaRepository,
        },
      ],
    }).compile();

    agendaRepository = await module.get<AgendaRepository>(AgendaRepository);
    service = await module.get<AgendaService>(AgendaService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(agendaRepository).toBeDefined();
  });

  describe('Criar agenda', () => {
    let mockCreateAgendaDto: CreateAgendaDto;

    beforeEach(() => {
      mockCreateAgendaDto = {
        titulo: 'Teste',
        descricao: 'descricao',
        data: new Date(),
        usuario: mockUsuario,
      };
    });

    it('deve criar agenda', async () => {
      (agendaRepository.createAgenda as jest.Mock).mockResolvedValue(
        'mockAgenda',
      );
      const result = await service.createAgenda(mockCreateAgendaDto);

      expect(agendaRepository.createAgenda).toHaveBeenCalledWith(
        mockCreateAgendaDto,
      );
      expect(result).toEqual('mockAgenda');
    });
  });

  describe('Pesquisar agenda', () => {
    it('deve retornar agenda encontrada', async () => {
      (agendaRepository.findOne as jest.Mock).mockResolvedValue('mockAgenda');
      expect(agendaRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findAgendaById('mockId');
      expect(agendaRepository.findOne).toHaveBeenCalledWith('mockId');
      expect(result).toEqual('mockAgenda');
    });

    it('deve lançar um erro porque agenda não foi encontrada', async () => {
      (agendaRepository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.findAgendaById('mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Pesquisar agendas', () => {
    it('deve chamar o método findAgenda do agendaRepository', async () => {
      (agendaRepository.findAgenda as jest.Mock).mockResolvedValue(
        'resultOfsearch',
      );
      const mockFindAgendaQueryDto: FindAgendaQueryDto = {
        titulo: 'Teste',
      };

      const result = await service.findAgenda(
        mockFindAgendaQueryDto,
        'mockIdEmpresa',
      );
      expect(agendaRepository.findAgenda).toHaveBeenCalledWith(
        mockFindAgendaQueryDto,
        'mockIdEmpresa',
      );
      expect(result).toEqual('resultOfsearch');
    });
  });

  describe('Atualizar agenda', () => {
    let mockUpdateAgendaDto: UpdateAgendaDto;

    beforeEach(() => {
      mockUpdateAgendaDto = {
        titulo: 'Teste 2',
        descricao: 'descricao',
      };
    });

    it('deve retornar afetado > 0 se os dados da agenda forem atualizados e retornar os novos dados', async () => {
      (agendaRepository.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });
      (agendaRepository.findOne as jest.Mock).mockResolvedValue('mockAgenda');

      const result = await service.updateAgenda(mockUpdateAgendaDto, 'mockId');

      expect(agendaRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        mockUpdateAgendaDto,
      );
      expect(result).toEqual('mockAgenda');
    });

    it('deve lançar um erro se nenhuma linha for afetada no banco de dados', async () => {
      (agendaRepository.update as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(
        service.updateAgenda(mockUpdateAgendaDto, 'mockId'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Deletar agenda', () => {
    it('deve retornar afetado > 0 se agenda for excluída', async () => {
      (agendaRepository.findOne as jest.Mock).mockResolvedValue('mockAgenda');
      expect(agendaRepository.findOne).not.toHaveBeenCalled();

      (agendaRepository.delete as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      await service.deleteAgenda('mockId');
      expect(agendaRepository.delete).toHaveBeenCalledWith({ id: 'mockId' });
    });

    it('deve lançar um erro se nenhuma agenda for excluída', async () => {
      (agendaRepository.delete as jest.Mock).mockResolvedValue({
        affected: 0,
      });

      expect(service.deleteAgenda('mockId')).rejects.toThrow(NotFoundException);
    });
  });
});
