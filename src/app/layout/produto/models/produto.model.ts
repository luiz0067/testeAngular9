export interface Produto {
  id: number;
  descricao: string; //min 5 max 100
  ativo: boolean;
  grupoId: number; //associação do id do cadastro de grupo
  preco: Preco;
  estoque: number; //min 0 max 999999999
  dateUpdate:Date;
  dateInsert:Date;

  }
  export interface Preco {
  venda: number; //min 0,01 max 999999999
  custo: number; //min 0,00 max 999999999
  }
