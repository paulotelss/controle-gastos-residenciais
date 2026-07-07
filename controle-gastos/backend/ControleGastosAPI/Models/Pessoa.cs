namespace ControleGastosAPI.Models;

/// <summary>
/// representa uma pessoa cadastrada no sistema.
/// </summary>
public class Pessoa
{
    /// <summary>
    /// identificador único da pessoa (chave primária, auto increment).
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// nome completo da pessoa. Campo obrigatório.
    /// </summary>
    public string Nome { get; set; } = string.Empty;

    /// <summary>
    /// idade da pessoa em anos. Utilizada para validação da regra de negócio (menor de 18 anos).
    /// </summary>
    public int Idade { get; set; }

    /// <summary>
    /// coleção de transações associadas a esta pessoa (relacionamento 1:N).
    /// inicializada como uma lista vazia para evitar null reference.
    /// </summary>
    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}