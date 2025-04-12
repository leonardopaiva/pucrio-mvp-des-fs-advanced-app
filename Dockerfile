# Dockerfile para o app React (frontend)
# deve-se rodar o comando npm run pwa para que exista o conteudo do dist/
# ele irá copiar o conteúdo do dist par ao nginx/html

FROM nginx:alpine

# Copia os arquivos estáticos gerados (pasta dist) para o diretório padrão do Nginx
COPY dist/ /usr/share/nginx/html

# Copia a configuração customizada do Nginx para sobrescrever o default
# necessário para permitir o reload em rotas filhas
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80 para acesso HTTP
EXPOSE 80

# Inicia o Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]
