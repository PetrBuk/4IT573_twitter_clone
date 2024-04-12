# Twitter clone for Node.js basics course

## Tech stack

- Express.js server
- ejs views
- Tailwind CSS
- HTMX interactivity

### Run PostgreSQL database

Do not forget to change passwords and DB name in commands bellow

```bash
docker run -d --name twittie -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=<your-password> -e POSTGRES_DB=<your-db-name> postgres:15
```
