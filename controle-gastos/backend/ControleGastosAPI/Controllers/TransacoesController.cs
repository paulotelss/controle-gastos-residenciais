using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastosAPI.Data;
using ControleGastosAPI.Models;

namespace ControleGastosAPI.Controllers;

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
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes()
    {
        return await _context.Transacoes.Include(t => t.Pessoa).ToListAsync();
    }

    // POST: api/transacoes
    [HttpPost]
    public async Task<ActionResult<Transacao>> PostTransacao(Transacao transacao)
    {
        // Busca a pessoa associada
        var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
        if (pessoa == null)
            return BadRequest("Pessoa não encontrada.");

        // REGRA DE NEGÓCIO: menor de 18 anos só pode cadastrar despesa
        if (pessoa.Idade < 18 && transacao.Tipo == "Receita")
        {
            return BadRequest("Menores de 18 anos só podem cadastrar despesas.");
        }

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTransacoes), new { id = transacao.Id }, transacao);
    }
}
