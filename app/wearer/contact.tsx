import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { COUNTRIES, DEFAULT_COUNTRY, dialCode, type CountryId } from '@/features/auth/countries';
import { countryOfDial, mobileProblem, onlyDigits } from '@/features/wearer/phone';
import { useWearer, type EmergencyContact } from '@/features/wearer/store';
import { useSession } from '@/services/auth/session';
import { Button, Input, Screen, Select, Text } from '@/ui';

/**
 * C6 · Add (or change) an emergency contact. The number is checked for the chosen country; there is no code to
 * confirm it. No channel choice: Svaraa calls them, and also sends a push if the number belongs to an app member.
 * Opened with `?index=n` it edits contact n and offers Remove.
 */
export default function AddContact() {
  const { t } = useTranslation();
  const router = useRouter();
  const { index } = useLocalSearchParams<{ index?: string }>();
  const contacts = useWearer((s) => s.contacts);
  const ownMobile = useSession((s) => s.mobile);
  const at = index !== undefined ? Number(index) : -1;
  const editing: EmergencyContact | undefined = contacts[at];

  const [name, setName] = useState(editing?.name ?? '');
  const [relationship, setRelationship] = useState(editing?.relationship ?? '');
  const [country, setCountry] = useState<CountryId>(
    editing ? countryOfDial(editing.countryCode) : DEFAULT_COUNTRY,
  );
  const [mobile, setMobile] = useState(editing?.mobile ?? '');
  const [problem, setProblem] = useState<string | null>(null);

  const save = async () => {
    const digits = onlyDigits(mobile);
    const full = `${dialCode(country)}${digits}`;
    const issue =
      mobileProblem(country, mobile) ??
      (ownMobile && full === ownMobile ? 'wearer.contact.ownNumber' : null) ??
      (contacts.some((c, i) => i !== at && `${c.countryCode}${c.mobile}` === full)
        ? 'wearer.contact.duplicate'
        : null);
    if (issue) {
      setProblem(issue);
      return;
    }
    const contact: EmergencyContact = {
      name: name.trim(),
      relationship: relationship.trim() || undefined,
      countryCode: dialCode(country),
      mobile: digits,
    };
    const list = [...contacts];
    if (editing) list[at] = contact;
    else list.push(contact);
    await useWearer.getState().save({ contacts: list });
    router.back();
  };

  const remove = async () => {
    await useWearer.getState().save({ contacts: contacts.filter((_, i) => i !== at) });
    router.back();
  };

  return (
    <Screen
      footer={
        <>
          <Button
            label={t('wearer.contact.save')}
            onPress={() => void save()}
            disabled={!name.trim() || !mobile.trim()}
            fullWidth
          />
          {editing ? (
            <Button label={t('wearer.contact.remove')} variant="tertiary" onPress={() => void remove()} />
          ) : null}
        </>
      }
    >
      <Button label={t('common.back')} variant="tertiary" onPress={() => router.back()} />
      <Text variant="title1" tone="heading" accessibilityRole="header">
        {editing ? t('wearer.contact.editTitle') : t('wearer.contact.title')}
      </Text>
      <Input label={t('wearer.contact.name')} value={name} onChangeText={setName} maxLength={100} />
      <Input
        label={t('wearer.contact.relationship')}
        value={relationship}
        onChangeText={setRelationship}
        maxLength={50}
      />
      <Select
        label={t('auth.phone.country')}
        title={t('auth.phone.country')}
        value={country}
        onChange={(id) => {
          setCountry(id);
          setProblem(null);
        }}
        options={COUNTRIES.map((c) => ({ id: c.id, label: `${t(`countries.${c.id}`)} (${c.dial})` }))}
      />
      <Input
        label={t('auth.phone.mobile')}
        value={mobile}
        onChangeText={(v) => {
          setMobile(v);
          setProblem(null);
        }}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        maxLength={15}
        error={problem ? t(problem) : undefined}
      />
      <Text variant="bodySm" tone="tertiary">
        {t('wearer.contact.howAlerted')}
      </Text>
    </Screen>
  );
}
