
<p align="center">
  <img src="EmeraldPath_Text.png" alt="Emerald Path Logo" width="600">
</p>


## Inspiration

Last week, unprecedented amounts of snow and ice ravaged cities across America. As students who mainly travel by foot, we have experienced firsthand the challenges of traversing through underplowed sidewalks and squeezing through piles of snow to simply cross the street. While we are privileged to not have to shoulder this burden on a regular basis, this is reality for millions of people worldwide.

Modern metropolises are known for their scale and connectivity, but urban infrastructure doesn’t take into account those with mobility needs. For these users, there are many unknown risks with taking sidewalks, leaving **12.2% of U.S. adults (roughly 1 in 8) who live with a mobility disability with “concrete anxiety.”** Up to **48% of sidewalks remain inaccessible,** which forces these individuals to stay home or get injured.  There is a lack of critical data on floor surfaces, path widths, and steep inclines, all of which can greatly impact safe city commute.

Research shows that people with mobility difficulties are nearly **4.6-10 times more likely to face depression and anxiety.** Effective digitial maps are proven to reduce such distress. However, programs such as Google Maps and Apple Maps aren’t specifically designed for those in need. In particular, our home city of Boston has **75,000+ citizens with disabilities** while simultaneously having ongoing issues regarding broken sidewalks, narrow pathways, and a backlog of 1,000+ pending curb ramp repairs. Even though it is a flat, historic walking city, many areas are uneven, brick-paved and make navigation difficult especially in the winter. We aim to directly combat this issue by creating a software that directly translates their concerns to reality. By providing a clear, accessible optimal route, we give users the courage to explore their campus and city without fear of the unknown.

## What it does

Our app is an interactive tool that allows users to filter sidewalks by specific preferences related to their needs, such as their preferred incline level, surface material, and sidewalk width. The sidewalks are clearly labeled on an interactive geospatial map, making it user-friendly and visually appealing. Moreover, our app features an algorithm that allows users to find routes between two locations that are compatible with their needs—a more accessible version of existing navigation tools.

## How we built it

Embedded within our React app is the Kepler.gl tool, allowing our location features, such as sidewalks and routes, to be visualized on an interactive map. Our program utilizes the [Sidewalk Inventory dataset](https://data.boston.gov/dataset/sidewalk-inventory) from Analyze Boston and parses the GeoJSON file to search for sidewalk information such as width, hazard level, surface material, and incline. Based on these datapoints, we implement a **filtering feature** where users can select/deselect the sidewalk characteristics that pose difficulties for them, and the map will update accordingly.

Our routing algorithm creates a graph of nodes and edges, where sidewalks are stored as nodes and the weight of each edge is proportional to the distance between sidewalks. Using the A* algorithm, we are able to find the route between two locations that **minimizes the total distance traveled and works with a specific user's needs.**

On the front-end, we started off in Figma where we built a high-fidelity prototype to map out the user flow and it was hard to translate this design completely. However, through trial and error with testing different buttons and colors and functionalities, we were able to replicate our idea into the WebApp. React.js was used to manage the application state and logic and made sure that the data interactions were speedy. Tailwind CSS was used to use exact margins, paddings, and color palettes to establish our brand color. We want our data to be accessible to everyone and so our application uses a lot of visual cues like drawn icons and custom filters. This makes the UI easy to read and navigable. 

## Challenges we ran into

While our initial idea was to create a program that displays snow hazards, as our inspiration came from the recent snowstorm, we were unable to find a suitable dataset to implement this feature. Moreover, the **currently available datasets are huge**—parsing our Sidewalk Inventory dataset took a few minutes, and visualizing all sidewalks on our map makes the application more laggy than we would like. For the routing algorithm, we were able to combat the challenge of algorithm runtime by limiting sidewalks that can be used to a certain area around the start and end locations; however, this could prove to be an issue as we attempt to expand our application to more locations around the world. Similarly, as sidewalks are shapes rather than just points, it is **difficult to exactly minimize the distance of the route**, as different sides of the sidewalk may have different distances to and from certain points. Our edge-node graph is a good simplification of the sidewalk system; yet a more precise way of storing the sidewalk data may be helpful.

## Accomplishments that we're proud of

This was the first hackathon for every member of our team! We are incredibly proud of being able to bring our ideas to life completely from scratch with limited technical experience as college freshmen. Dedicating ourselves to this project for the past 24+ hours has been tiring but immensely fulfilling, and we truly believe that our application, with adequate development and prototyping in the future, can make a lasting impact for millions of people.

## What we learned

On the planning side, we learned how to brainstorm and do the initial research necessary to ensure that the rest of the workflow goes smoothly. Rather than junmping directly into software development, we spent a considerable amount of research which tools we had at our disposable, and whether or not they would be compatible with one another. Of course, we were not able to use all of the libraries and APIs that we initially found, but our knowledge of what is available has broadened significantly, and we have gained a deeper appreciation for the tools that are available and the possibilities that lie ahead.

On the technical side, we all gained invaluable experience not only with using React, Javascript, Tailwind, CSS, Figma, and Kepler separately, but being able to combine them together to assemble a grander project. We all ventured out of our comfort zones and had to try something new that we have never done before, such as using Figma or coding in a new language—despite inevitable challenges, our perseverance and determination led us to a final product that we are proud of.

(on a real note, we learned that sleeping on an air mattress and operating on minimal sleep is hard :sweat_smile:)

## What's next for Emerald Path

As many factors that may affect sidewalk accessibility—such as presence of snow—need to be updated in real-time, we hope to implement a feature where users can update the live status of the sidewalk on a day-to-day basis. The attributes of each sidewalk will be updated accordingly, and the algorithm will be able to give more accurate routing recommendations for users with disabilities. In addition, as we improve the functionalities of the program, we hope to expand our reach to more and more cities, not just Boston.

**Link to YouTube Demo Video: [https://youtu.be/lfZURz6bUQU](https://youtu.be/lfZURz6bUQU)**

---


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
