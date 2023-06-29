export const ALL_PERMISSIONS = [
  //convention - name of resource followed by the action the user can perform on that resource

  //superadmin can only do this
  //need to implement a guard to do this
  "users:roles:write", //allowed to add a role to a user

  "users:roles:delete", //allowed to remove a role from a user

  //roles
  "roles:write",

  //posts
  "posts:write",
  "posts:read",
  "posts:delete",
  "posts:edit-own",
] as const; // this list here is read only so ts knows and gives us better type checking

//reduce- 1st obj is a accumulator, 2nd obj is the current element
export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc, permission) => {
  acc[permission] = permission;

  return acc;
}, {} as Record<(typeof ALL_PERMISSIONS)[number], (typeof ALL_PERMISSIONS)[number]>);

export const USER_ROLE_PERMISSIONS = [
  PERMISSIONS["posts:write"],
  PERMISSIONS["posts:read"],
];

//system roles
export const SYSTEM_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  APPLICATION_USER: "APPLICATION_USER",
};
