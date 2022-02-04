import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { VendasController } from './vendas.controller';
import { VendasService } from './vendas.service';
import { ProdutosVendaService } from '../produtos_venda/produtos_venda.service';
import { ServicosVendaService } from '../servicos_venda/servicos_venda.service';
import { Empresa } from '../empresa/empresa.entity';
import { Clientes } from '../clientes/clientes.entity';
import { CreateVendaDto } from './dto/create-venda-dto';
import { Usuario } from '../usuario/usuario.entity';
import { UpdateVendaDto } from './dto/update-venda-dto';
import { RemoveProdutoVendaDto } from './dto/remove-produto-venda-dto';
import { RemoveServicoVendaDto } from './dto/remove-servico-venda-dto';

describe('VendasController', () => {
  let vendaController: VendasController;
  let vendaService: VendasService;

  const mockEmpresa = { id: '5' } as Empresa;
  const mockUsuario = { id: '1' } as Usuario;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [VendasController],
      providers: [
        {
          provide: VendasService,
          useValue: createMock<VendasService>(),
        },
        {
          provide: ProdutosVendaService,
          useValue: createMock<ProdutosVendaService>(),
        },
        {
          provide: ServicosVendaService,
          useValue: createMock<ServicosVendaService>(),
        },
      ],
    }).compile();

    vendaService = moduleRef.get<VendasService>(VendasService);
    vendaController = moduleRef.get<VendasController>(VendasController);
  });

  it('Deve ser definido', async () => {
    expect(vendaController).toBeDefined();
  });

  it('Deve buscar venda por id', async () => {
    await vendaController.findVendaById(1);

    expect(vendaService.findVendaById).toBeCalled();
  });

  it('deve buscar vendas pelos filtros ou retorna todas caso não informe os filtros', async () => {
    const query = {
      cliente: 'Cliente Teste',
    };

    await vendaController.findVendas(query, mockEmpresa);

    expect(vendaService.findVendas).toBeCalled();
  });

  it('deve criar a venda com produto', async () => {
    const mockVenda: CreateVendaDto = {
      cliente: { id: '1', nome: 'Cliente Teste' } as Clientes,
      produtos: [{ id: 1, descricao: 'Produto Teste' }],
      dataVenda: new Date(),
      valorTotal: 100,
      pagamento: 100,
      valorTroco: 0,
      empresa: mockEmpresa,
      usuario: mockUsuario,
    };

    expect(
      await vendaController.createVenda(mockVenda, mockEmpresa, mockUsuario),
    ).toMatchObject({
      venda: {},
      message: 'Venda cadastrada com sucesso',
    });
  });

  it('deve criar a venda com serviço', async () => {
    const mockVenda: CreateVendaDto = {
      cliente: { id: '1', nome: 'Cliente Teste' } as Clientes,
      servicos: [{ id: 1, nome: 'Serviço Teste' }],
      dataVenda: new Date(),
      valorTotal: 100,
      pagamento: 100,
      valorTroco: 0,
      empresa: mockEmpresa,
      usuario: mockUsuario,
    };

    expect(
      await vendaController.createVenda(mockVenda, mockEmpresa, mockUsuario),
    ).toMatchObject({
      venda: {},
      message: 'Venda cadastrada com sucesso',
    });
  });

  it('deve atualizar a venda por id', async () => {
    const mockVenda: UpdateVendaDto = {
      valorTotal: 100,
      pagamento: 100,
      valorTroco: 0,
    };

    expect(await vendaController.updateVenda(mockVenda, 'mockIdVenda'));
  });

  it('deve finalizar a venda por id', async () => {
    expect(await vendaController.finalizaVenda('mockIdVenda')).toMatchObject({
      venda: {},
      message: 'Venda finalizada',
    });
  });

  it('deve cancelar a venda por id', async () => {
    expect(
      await vendaController.cancelaVenda('mockIdVenda', mockEmpresa),
    ).toMatchObject({
      venda: {},
      message: 'Venda cancelada',
    });
  });

  it('deve adicionar produto na venda por id', async () => {
    const mockVendaUpdate: UpdateVendaDto = {
      cliente: { id: '1', nome: 'Cliente Teste' } as Clientes,
      produtos: [
        { id: 1, descricao: 'Produto Teste' },
        { id: 2, descricao: 'Produto Teste 2' },
      ],
    };

    const result = await vendaController.adicionaProdutoVenda(
      mockVendaUpdate,
      mockEmpresa,
      1,
    );

    expect(result).toMatchObject({
      produtoVenda: result.produtoVenda,
      valorVenda: result.valorVenda,
      message: 'Produto adicionado com sucesso na venda',
    });
  });

  it('deve adicionar serviço na venda por id', async () => {
    const mockVendaUpdate: UpdateVendaDto = {
      cliente: { id: '1', nome: 'Cliente Teste' } as Clientes,
      servicos: [
        { id: 1, descricao: 'Serviço Teste' },
        { id: 2, descricao: 'Serviço Testee 2' },
      ],
    };

    const result = await vendaController.adicionaServicoVenda(
      mockVendaUpdate,
      mockEmpresa,
      1,
    );

    expect(result).toMatchObject({
      servicoVenda: result.servicoVenda,
      valorVenda: result.valorVenda,
      message: 'Serviço adicionado com sucesso na venda',
    });
  });

  it('deve remover produto da venda por id', async () => {
    const mockRemoveProdutoVenda: RemoveProdutoVendaDto = {
      produtoVenda: 1,
      produto: 1,
    };

    expect(
      await vendaController.removeProdutoVenda(
        1,
        mockEmpresa,
        mockRemoveProdutoVenda,
      ),
    ).toMatchObject({
      valorVenda: 100,
      message: 'Produto removido com sucesso da venda',
    });
  });

  it('deve remover serviço da venda por id', async () => {
    const mockRemoveServicoVenda: RemoveServicoVendaDto = {
      servico: 1,
    };

    expect(
      await vendaController.removeServicoVenda(
        mockRemoveServicoVenda,
        1,
        mockEmpresa,
      ),
    ).toMatchObject({
      valorVenda: 100,
      message: 'Serviço removido com sucesso da venda',
    });
  });
});
