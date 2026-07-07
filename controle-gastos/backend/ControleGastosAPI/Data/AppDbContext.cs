using Microsoft.EntityFrameworkCore;
using ControleGastosAPI.Models;

namespace ControleGastosAPI.Data;

/// <summary>
/// contexto do Entity Framework Core para acesso ao banco de dados SQLite.
/// responsável por mapear as entidades e configurar relacionamentos.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // DbSet que representa a tabela Pessoas no banco
    public DbSet<Pessoa> Pessoas { get; set; }

    // DbSet que representa a tabela Transacoes no banco
    public DbSet<Transacao> Transacoes { get; set; }

    /// <summary>
    /// configuração do modelo de dados (fluent API).
    /// aqui definimos o relacionamento entre Pessoa e Transacao e a regra de exclusão em cascata.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // relacionamento: uma Pessoa tem muitas Transacoes (1:N)
        // configura a chave estrangeira PessoaId e define o comportamento de exclusão como Cascade.
        // isso significa que, ao excluir uma Pessoa, todas as suas Transacoes também serão excluídas automaticamente.
        modelBuilder.Entity<Transacao>()
            .HasOne(t => t.Pessoa)                // Uma Transacao pertence a uma Pessoa
            .WithMany(p => p.Transacoes)          // Uma Pessoa tem muitas Transacoes
            .HasForeignKey(t => t.PessoaId)       // Chave estrangeira na tabela Transacoes
            .OnDelete(DeleteBehavior.Cascade);    // Ao deletar a Pessoa, deleta as Transacoes (cascade)
    }
}