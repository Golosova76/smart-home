import type {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { LoadingService } from "@/app/shared/services/loading.service";
import { resolveChannelByUrl } from "@/app/shared/models/loading.model";
import { finalize } from "rxjs";

export const loadingInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  nextHandler: HttpHandlerFn,
) => {
  const loadingService: LoadingService = inject(LoadingService);

  const loadingChannel = resolveChannelByUrl(request.url);
  const endLoading = loadingChannel
    ? loadingService.begin(loadingChannel)
    : null;

  return nextHandler(request).pipe(
    finalize((): void => {
      if (endLoading) endLoading();
    }),
  );
};
