using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastosAPI.Data;
using ControleGastosAPI.Models;

namespace ControleGastosAPI.Controllers;

/// <summary>
/// Controller responsável pelas operações relacionadas a transações (receitas e despesas).
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/transacoes
    /// <summary>
    /// Retorna todas as transações cadastradas, incluindo os dados da pessoa associada.
    /// </summary>
    /// <returns>Lista de transações com a pessoa incluída</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes()
    {
        // Include(t => t.Pessoa) garante que os dados da pessoa sejam carregados junto com a transação (Eager Loading)
        return await _context.Transacoes.Include(t => t.Pessoa).ToListAsync();
    }

    // POST: api/transacoes
    /// <summary>
    /// Cria uma nova transação, aplicando a regra de negócio:
    /// - Se a pessoa for menor de 18 anos, apenas despesas são permitidas.
    /// - A pessoa informada deve existir no cadastro.
    /// </summary>
    /// <param name="transacao">Dados da transação a ser criada</param>
    /// <returns>Transação criada com status 201 Created</returns>
    [HttpPost]
    public async Task<ActionResult<Transacao>> PostTransacao(Transacao transacao)
    {
        // busca a pessoa associada à transação para validar a regra de idade
        var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
        if (pessoa == null)
            return BadRequest("Pessoa não encontrada.");

        // REGRA DE NEGÓCIO: menor de 18 anos só pode cadastrar despesa
        if (pessoa.Idade < 18 && transacao.Tipo == "Receita")
        {
            return BadRequest("Menores de 18 anos só podem cadastrar despesas.");
        }

        // adiciona a transação ao contexto e persiste no banco
        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        // retorna a transação criada com o status 201 Created e a rota para obtê-la via GET
        return CreatedAtAction(nameof(GetTransacoes), new { id = transacao.Id }, transacao);
    }
}