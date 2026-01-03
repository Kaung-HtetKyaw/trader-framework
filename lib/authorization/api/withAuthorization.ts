import { ApiClient, createAxiosInstance } from '@/lib/api/axios';
import { ErrorMessages } from '@/lib/utils/error';
import { BasePermissionEnum } from '@/types/user/permissions';
import { jwtDecode } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';
import { defineAbilitiesFor } from '../casl/abilities';
import { UserRoleEnum } from '@/types/user';
import { EntityEnum } from '@/types/user/entities';

export type NextBaseContext = {
  params: Record<string, string>;
  searchParams: Record<string, string>;
};

export type NextHandler = <T extends NextBaseContext>(
  req: NextRequest,
  context: NextHandlerContext<T>
) => Promise<void | NextResponse>;

export type NextHandlerContext<T extends NextBaseContext> = {
  params: T['params'];
  searchParams: T['searchParams'];
  apiClient: ApiClient;
};

export type WithAuthorizationFn = (
  handler: NextHandler,
  permissions: BasePermissionEnum[],
  entity: EntityEnum
) => NextHandlerWithAuthorization;

export type NextHandlerWithAuthorization = <T extends NextBaseContext>(
  req: NextRequest,
  context: NextHandlerWithAuthorizationContext<T>
) => Promise<void | NextResponse>;

export type NextHandlerWithAuthorizationContext<T extends NextBaseContext> = NextHandlerContext<T>;

// * Leaving this as a reference in case we need to checks FE server side (auth checks) later
const withAuthorization: WithAuthorizationFn = (handler, permissions, entity) => {
  return async (req, context) => {
    try {
      const bearerToken = req.headers.get('authorization') || '';
      const accessToken = bearerToken.split(' ')[1];

      const apiClient = createAxiosInstance(accessToken);

      const decodedToken = jwtDecode<{ role: UserRoleEnum }>(accessToken);

      const ability = defineAbilitiesFor(decodedToken.role);

      const hasPermission = permissions.every(permission => ability.can(permission, entity));

      if (!hasPermission) {
        return NextResponse.json(ErrorMessages.UNAUTHORIZED, { status: 401 });
      }

      return handler(req, { ...context, apiClient });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }

      return NextResponse.json(ErrorMessages.INTERNAL_SERVER_ERROR, { status: 500 });
    }
  };
};

export default withAuthorization;
