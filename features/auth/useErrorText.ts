import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { errorMessageKey, toApiError } from '@/services/api';

/** Turns anything thrown by an API call into text for the person, in their language. Never shows server text. */
export function useErrorText() {
  const { t } = useTranslation();
  return useCallback((error: unknown) => t(errorMessageKey(toApiError(error).code)), [t]);
}
