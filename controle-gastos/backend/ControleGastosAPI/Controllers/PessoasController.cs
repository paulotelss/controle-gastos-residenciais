using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleGastosAPI.Data;
using ControleGastosAPI.Models;

namespace ControleGastosAPI.Controllers;

/// <summary>
/// Controller responsável pelas operações relacionadas a pessoas.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly AppDbContext _context;

    public PessoasController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/pessoas
    /// <summary>
    /// Retorna todas as pessoas cadastradas, incluindo suas transações (Eager Loading).
    /// </summary>
    /// <returns>Lista de pessoas com suas transações</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
    {
        // Include(p => p.Transacoes) carrega as transações junto com a pessoa, evitando múltiplas consultas ao banco
        return await _context.Pessoas.Include(p => p.Transacoes).ToListAsync();
    }

    // POST: api/pessoas
    /// <summary>
    /// cria uma nova pessoa no banco de dados.
    /// </summary>
    /// <param name="pessoa">Dados da pessoa a ser criada</param>
    /// <returns>Pessoa criada com status 201 Created</returns>
    [HttpPost]
    public async Task<ActionResult<Pessoa>> PostPessoa(Pessoa pessoa)
    {
        // adiciona a pessoa ao contexto e persiste no banco
        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        // retorna a pessoa criada com status 201 Created e a rota para obtê-la via GET
        return CreatedAtAction(nameof(GetPessoas), new { id = pessoa.Id }, pessoa);
    }

    // DELETE: api/pessoas/{id}
    /// <summary>
    /// Remove uma pessoa do banco de dados.
    /// ATENÇÃO: O relacionamento com Transacoes está configurado com ON DELETE CASCADE.
    /// portanto, ao deletar uma pessoa, todas as suas transações são removidas automaticamente.
    /// </summary>
    /// <param name="id">ID da pessoa a ser deletada</param>
    /// <returns>Status 204 No Content em caso de sucesso</returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePessoa(int id)
    {
        // busca a pessoa pelo ID
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa == null)
            return NotFound();

        // remove a pessoa do contexto
        _context.Pessoas.Remove(pessoa);

        // o SaveChanges() acionará o cascade delete configurado no DbContext,
        // removendo automaticamente todas as transações associadas a esta pessoa.
        await _context.SaveChangesAsync();

        return NoContent();
    }
}