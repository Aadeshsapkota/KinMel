export function redirectToEsewa(
  paymentUrl: string,
  formData: Record<string, string>
) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentUrl;

  Object.entries(formData).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}