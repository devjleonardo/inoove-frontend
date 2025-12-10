# Services v2

Esta pasta contém os novos services que consomem a API v2.

## Estrutura

Os services aqui seguem o mesmo padrão dos services v1, mas utilizam a instância `apiV2` que aponta para `http://localhost:8090`.

## Como criar um novo service v2

1. Crie o arquivo do service nesta pasta (ex: `nomeService.ts`)
2. Importe a instância do axios de `./apiV2`
3. Configure os endpoints (ex: `/endpoint`)
4. Exporte o service e seus tipos

## Exemplo

```typescript
import apiV2 from './apiV2';

export interface ExemploDTO {
  id: string;
  nome: string;
}

class ExemploService {
  async getExemplo(): Promise<ExemploDTO> {
    const response = await apiV2.get<ExemploDTO>('/exemplo');
    return response.data;
  }
}

export const exemploService = new ExemploService();
```

## Configuração

A URL base da API v2 pode ser configurada através da variável de ambiente:
- `NEXT_PUBLIC_API_V2_URL` - URL da API v2 (padrão: `http://localhost:8090`)
