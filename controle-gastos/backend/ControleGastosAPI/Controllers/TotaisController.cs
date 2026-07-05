using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastosAPI.Data;

namespace ControleGastosAPI.Controllers;

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
    [HttpGet]
    public async Task<IActionResult> GetTotais()
    {
        // Busca todas as pessoas com suas transações
        var pessoas = await _context.Pessoas
            .Include(p => p.Transacoes)
            .ToListAsync();

        // Lista para armazenar os totais por pessoa
        var totaisPorPessoa = new List<object>();
        decimal totalReceitasGeral = 0;
        decimal totalDespesasGeral = 0;

        foreach (var pessoa in pessoas)
        {
            decimal receitas = pessoa.Transacoes
                .Where(t => t.Tipo == "Receita")
                .Sum(t => t.Valor);

            decimal despesas = pessoa.Transacoes
                .Where(t => t.Tipo == "Despesa")
                .Sum(t => t.Valor);

            decimal saldo = receitas - despesas;

            totalReceitasGeral += receitas;
            totalDespesasGeral += despesas;

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

        // Monta a resposta com os totais por pessoa e os totais gerais
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

        return Ok(resultado);
    }
}
