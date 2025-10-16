# Overview

Scale Survey is a minimalist survey application designed to let registered users create and manage live surveys. These surveys can be distributed to anonymous participants through unique short URLs.

- The production website is available at [www.scalesurvey.com](https://www.scalesurvey.com)
- Each survey receives a dedicated short URL in the format `<survey-id>.scalesurvey.com`
- Survey owners can choose whether participants are able to view live survey results on the survey page
- Every survey has configurable start and end dates set before launch
- Survey owners can save surveys as drafts and publish them when ready

## Development Guidelines

- Use [bun](https://bun.sh/) as the package manager
- Use [shadcn/ui](https://ui.shadcn.com/) as the component library; UI components are located at `@/components/ui`
- Follow the [Next.js App Router](https://nextjs.org/docs/app) architecture
