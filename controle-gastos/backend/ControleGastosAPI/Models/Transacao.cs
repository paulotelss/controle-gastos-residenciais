namespace ControleGastosAPI.Models;

/// <summary>
/// representa uma transação financeira (receita ou despesa) associada a uma pessoa.
/// </summary>
public class Transacao
{
    /// <summary>
    /// identificador único da transação (gerado automaticamente pelo banco).
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// descrição da transação (ex: "Salário", "Obra", "Supermercado").
    /// </summary>
    public string Descricao { get; set; } = string.Empty;

    /// <summary>
    /// valor monetário da transação.
    /// </summary>
    public decimal Valor { get; set; }

    /// <summary>
    /// tipo da transação: "Receita" ou "Despesa".
    /// </summary>
    public string Tipo { get; set; } = string.Empty;

    /// <summary>
    /// chave estrangeira para a pessoa associada.
    /// </summary>
    public int PessoaId { get; set; }

    /// <summary>
    /// navegação para a pessoa associada (propriedade opcional para evitar loops de serialização).
    /// </summary>
    public Pessoa? Pessoa { get; set; }
}