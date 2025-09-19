import { useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { useI18n } from "@/lib/use-i18n";

export default function Form({ onSubmit, defaultValues, onCancel }) {
  const { data: categories, isLoading, error } = useSWR("/api/categories");

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { translate } = useI18n();

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    let rawAmount = data.amount.replace(",", ".");
    let amount = Math.abs(Number(rawAmount));
    if (data.type === "expense") {
      amount = -amount;
    }
    data.amount = amount;

    setIsButtonDisabled(true);
    await onSubmit(data);
    setIsButtonDisabled(false);

    form.reset();
    form.elements.name.focus();
  }

  function handleReset() {
    onCancel?.();
  }

  const today = new Date().toISOString().slice(0, 10);
  if (error) return <p role="alert">Failed to load categories</p>;
  if (isLoading) return <p role="status">Loading categories...</p>;
  return (
    <>
      <FormWrapper>
        <HeaderForm>{translate("form.header")}</HeaderForm>
        <FormContainer onSubmit={handleSubmit}>
          <Label htmlFor="name">{translate("form.name")}</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder={translate("form.namePh")}
            autoComplete="off"
            required
            defaultValue={defaultValues?.name}
          />
          <Label htmlFor="amount">{translate("form.amount")}</Label>
          <Input
            id="amount"
            name="amount"
            type="text"
            placeholder={translate("form.amount")}
            inputMode="decimal"
            pattern="[0-9]+([,.][0-9]{1,2})?"
            required
            defaultValue={
              typeof defaultValues?.amount === "number"
                ? Math.abs(defaultValues.amount)
                : defaultValues?.amount
            }
          />
          <Select
            id="category"
            name="category"
            defaultValue={defaultValues?.category}
            required
          >
            <option value="" disabled>
              {translate("form.chooseCategory")}
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
          <TypeRow aria-label={translate("form.type")}>
            <HiddenRadio
              id="type-income"
              value="income"
              name="type"
              type="radio"
              required
              defaultChecked={defaultValues?.type === "income"}
            />
            <Label htmlFor="type-income">{translate("form.income")}</Label>
            <HiddenRadio
              id="type-expense"
              value="expense"
              name="type"
              type="radio"
              required
              defaultChecked={defaultValues?.type === "expense"}
            />
            <Label htmlFor="type-expense">{translate("form.expense")}</Label>
          </TypeRow>
          <Label htmlFor="date">{translate("form.date")}</Label>
          <Input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={
              defaultValues?.date
                ? new Date(defaultValues.date).toISOString().slice(0, 10)
                : today
            }
          />
          <ButtonContainer>
            <AddButton
              type="submit"
              disabled={isButtonDisabled}
              data-tour="submit-transaction"
            >
              {defaultValues ? translate("common.save") : translate("form.add")}
            </AddButton>
            <CancelButton
              type="reset"
              onClick={handleReset}
              disabled={isButtonDisabled}
              aria-label="Cancel and close the form"
              data-tour="cancel-form"
            >
              {translate("form.cancelAria")}
            </CancelButton>
          </ButtonContainer>
        </FormContainer>
      </FormWrapper>
    </>
  );
}

const FormWrapper = styled.div`
  padding: 0 24px;
  max-width: 650px;
  margin: 45px auto 0;
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  grid-column: 1 / -1;
`;

const HeaderForm = styled.h3`
  margin: 0 0 20px;
`;

const FormContainer = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  width: 100%;
  padding-bottom: calc(
    var(--bottom-nav-h, 64px) + env(safe-area-inset-bottom, 0px) + 24px
  );
`;

const Input = styled.input`
  background: var(--surface-elevated);
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  width: 100%;
`;

const TypeRow = styled.div`
  grid-column: 1 / -1;
  display: inline-flex;
  gap: 12px;
  align-items: center;
  Label {
    grid-column: auto;
    padding: 6px 12px;
    border-radius: 25px;
    cursor: pointer;
  }

  input[type="radio"]:checked + Label {
    background: var(--pb-100, #d4eeff);
    color: var(--pb-900, #0f34a0);
    box-shadow: inset 0 0 0 1px var(--pb-400, #559aff);
  }
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  margin: 0;
  pointer-events: none;
`;

const Label = styled.label`
  grid-column: 1/-1;
  font-weight: 600;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
`;

const AddButton = styled.button`
  grid-column: 1/-1;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--primary);
  color: var(--primary);
  width: 100%;
`;
const CancelButton = styled.button`
  grid-column: 1/-1;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--primary);
  color: var(--negative);
  width: 100%;
`;

const Select = styled.select`
  background: var(--surface-elevated);
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  grid-column: 1 / -1;
  width: 100%;
`;
