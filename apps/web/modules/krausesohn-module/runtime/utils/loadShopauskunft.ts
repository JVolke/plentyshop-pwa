export async function loadShopauskunftWidget(): Promise<void> {
  const scriptId = 'shopauskunft-widget-script';
  const scriptSrc = 'https://widget.shopauskunft.de/assets/widget.js';

  // Browser-only
  if (process.server) return;

  // Script nur einmal laden
  if (!document.getElementById(scriptId)) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = scriptSrc;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Widget-Script konnte nicht geladen werden'));
      document.head.appendChild(script);
    });
  }

  // 👉 Wir simulieren das Event nochmal
  document.dispatchEvent(new Event('DOMContentLoaded'));
}
