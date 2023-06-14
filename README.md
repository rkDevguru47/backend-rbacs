# Multi Tenant Role Based Access Control (RBAC) Authentication API

#Using
<img src="./img/neon.svg" />

# go to main.ts to see how this works 
// neon has branches that come in handy like having production, development and test branches
// has tables to verify that our database migrations have actually run
// has sql editor that is handy to look what is in your database and do the modifications when needed
// can see the operations that were porformed in your database


#drizzle config is for migrations 
#you can view scripts inside package.json to see what can be run

#on running 'pnpm migrate' auto migrations are created in a new folder called migrations
// responseTime: 460.93899999931455  on running local server using PS on VScode before optimising
// muliple awaits and calling singe await..
// responseTime: 397.3292999975383 with improvements i.e. single await in controller
