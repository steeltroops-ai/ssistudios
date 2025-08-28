# SSI Studios

SSI Studios is a professional design dashboard web application built with Next.js. It provides users with a comprehensive suite of creative tools and resources to manage and create design projects such as posters, cards, certificates, and logos.

## Features

- **Dashboard:** A central hub showcasing templates, tools, and creative resources for design projects.
- **Templates:** Browse and manage professional design templates for various project types.
- **Logo Management:** View, filter, and manage a collection of logos with detailed metadata including categories, tags, author, downloads, likes, and more.
- **Recent Projects:** Quickly access and continue working on your latest design projects with status indicators and project details.
- **Creative Tools:** Advanced editing tools for posters, logos, and other design assets.

## Technologies Used

- Built with [Next.js](https://nextjs.org) for server-side rendering and optimized performance.
- Uses React with TypeScript for robust and scalable frontend development.
- Framer Motion for smooth animations and interactive UI components.
- Lucide React icons for consistent and modern iconography.

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ssistudios
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## API Endpoints

The project includes several API endpoints to manage design assets and user data. Example endpoints include:

- `GET /api/templates` - Retrieve available design templates.
- `POST /api/projects` - Create a new design project.
- `GET /api/logos` - Fetch logos with filtering and sorting options.
- `PUT /api/projects/:id` - Update an existing project.
- `DELETE /api/projects/:id` - Delete a project.

Refer to the API documentation or source code for detailed request and response formats.

## Project Structure

- `app/(dashboard)/dashboard`: Main dashboard page and components.
- `app/(tools)/logo`: Logo management components and data.
- `components/dashboard`: UI components for dashboard features like recent projects.
- `lib/contexts`: React context providers for navigation and authentication.

## Deployment

The project can be easily deployed on the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), the creators of Next.js.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

This project is a solid foundation for building a professional design studio dashboard with extensible tools and resources for creative professionals.# SSI Studios

SSI Studios is a professional design dashboard web application built with Next.js. It provides users with a comprehensive suite of creative tools and resources to manage and create design projects such as posters, cards, certificates, and logos.

## Features

- **Dashboard:** A central hub showcasing templates, tools, and creative resources for design projects.
- **Templates:** Browse and manage professional design templates for various project types.
- **Logo Management:** View, filter, and manage a collection of logos with detailed metadata including categories, tags, author, downloads, likes, and more.
- **Recent Projects:** Quickly access and continue working on your latest design projects with status indicators and project details.
- **Creative Tools:** Advanced editing tools for posters, logos, and other design assets.

## Technologies Used

- Built with [Next.js](https://nextjs.org) for server-side rendering and optimized performance.
- Uses React with TypeScript for robust and scalable frontend development.
- Framer Motion for smooth animations and interactive UI components.
- Lucide React icons for consistent and modern iconography.

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ssistudios
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## API Endpoints

The project includes several API endpoints to manage design assets and user data. Example endpoints include:

- `GET /api/templates` - Retrieve available design templates.
- `POST /api/projects` - Create a new design project.
- `GET /api/logos` - Fetch logos with filtering and sorting options.
- `PUT /api/projects/:id` - Update an existing project.
- `DELETE /api/projects/:id` - Delete a project.

Refer to the API documentation or source code for detailed request and response formats.

## Project Structure

- `app/(dashboard)/dashboard`: Main dashboard page and components.
- `app/(tools)/logo`: Logo management components and data.
- `components/dashboard`: UI components for dashboard features like recent projects.
- `lib/contexts`: React context providers for navigation and authentication.
