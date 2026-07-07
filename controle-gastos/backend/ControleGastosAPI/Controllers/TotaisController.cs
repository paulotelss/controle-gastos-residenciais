using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastosAPI.Data;

namespace ControleGastosAPI.Controllers;

/// <summary>
/// Controller responsável pela consulta de totais financeiros.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TotaisController : ControllerBase
{
    private readonly AppDbContext _context;

    public TotaisController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/totais
    /// <summary>
    /// Retorna o consolidado financeiro por pessoa e os totais gerais.
    /// </summary>
    /// <returns>
    /// - totaisPorPessoa: lista com ID, Nome, Idade, TotalReceitas, TotalDespesas e Saldo de cada pessoa.
    /// - totaisGerais: TotalReceitas, TotalDespesas e SaldoLiquido de todas as pessoas.
    /// </returns>
    [HttpGet]
    public async Task<IActionResult> GetTotais()
    {
        // busca todas as pessoas com suas transações (Eager Loading)
        var pessoas = await _context.Pessoas
            .Include(p => p.Transacoes)
            .ToListAsync();

        // lista para armazenar os totais por pessoa
        var totaisPorPessoa = new List<object>();

        // variáveis para acumular os totais gerais
        decimal totalReceitasGeral = 0;
        decimal totalDespesasGeral = 0;

        // para cada pessoa, calcula suas receitas, despesas e saldo
        foreach (var pessoa in pessoas)
        {
            // soma os valores das transações do tipo "Receita" para a pessoa
            decimal receitas = pessoa.Transacoes
                .Where(t => t.Tipo == "Receita")
                .Sum(t => t.Valor);

            // soma os valores das transações do tipo "Despesa" para a pessoa
            decimal despesas = pessoa.Transacoes
                .Where(t => t.Tipo == "Despesa")
                .Sum(t => t.Valor);

            // calcula o saldo da pessoa (receitas - despesas)
            decimal saldo = receitas - despesas;

            // acumula os totais gerais
            totalReceitasGeral += receitas;
            totalDespesasGeral += despesas;

            // adiciona o resumo da pessoa à lista
            totaisPorPessoa.Add(new
            {
                pessoa.Id,
                pessoa.Nome,
                pessoa.Idade,
                TotalReceitas = receitas,
                TotalDespesas = despesas,
                Saldo = saldo
            });
        }

        // monta o objeto de resposta com os totais por pessoa e os totais gerais
        var resultado = new
        {
            TotaisPorPessoa = totaisPorPessoa,
            TotaisGerais = new
            {
                TotalReceitas = totalReceitasGeral,
                TotalDespesas = totalDespesasGeral,
                SaldoLiquido = totalReceitasGeral - totalDespesasGeral
            }
        };

        // retorna o resultado com status 200 OK
        return Ok(resultado);
    }
}