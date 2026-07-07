using Microsoft.EntityFrameworkCore;
using ControleGastosAPI.Data;

// cria o builder da aplicação Web API
var builder = WebApplication.CreateBuilder(args);

// configuração do DbContext com SQLite
// lê a string de conexão do appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// configuração dos Controllers com serialização JSON para evitar loops de referência
// referenceHandler.Preserve mantém a estrutura dos objetos com $id, $values e $ref
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.MaxDepth = 64; // Profundidade máxima para objetos aninhados
    });

// adiciona suporte ao Swagger (OpenAPI) para documentação e testes da API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// configuração de CORS (Cross-Origin Resource Sharing)
// permite que qualquer origem, método e cabeçalho acesse a API
// útil para comunicação com o frontend React em desenvolvimento
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// constrói a aplicação
var app = builder.Build();

// aplica a política de CORS definida anteriormente
app.UseCors("AllowAll");

// configura o Swagger apenas em ambiente de desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// redireciona HTTP para HTTPS (segurança)
app.UseHttpsRedirection();

// Middleware de autorização (não utilizado neste projeto, mas mantido para futuras extensões)
app.UseAuthorization();

// mapeia as rotas dos Controllers (ex: /api/pessoas, /api/transacoes, /api/totais)
app.MapControllers();

// inicia a aplicação
app.Run();