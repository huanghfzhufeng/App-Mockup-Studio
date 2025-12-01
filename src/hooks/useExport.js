import html2canvas from 'html2canvas';

export function useExport() {
  const exportImage = async (elementRef, scale = 2) => {
    if (!elementRef.current) return false;

    try {
      const canvas = await html2canvas(elementRef.current, {
        scale,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `mockup_export_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return { exportImage };
}
