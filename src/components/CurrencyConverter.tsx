import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
];

interface ExchangeRates {
  [key: string]: number;
}

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [convertedAmount, setConvertedAmount] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchExchangeRates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();
      setExchangeRates(data.rates);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch exchange rates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, [fromCurrency]);

  useEffect(() => {
    if (exchangeRates[toCurrency] && amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        const converted = (numAmount * exchangeRates[toCurrency]).toFixed(2);
        setConvertedAmount(converted);
      }
    }
  }, [amount, toCurrency, exchangeRates]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getSymbol = (currencyCode: string) => {
    return CURRENCIES.find(c => c.code === currencyCode)?.symbol || currencyCode;
  };

  const getRate = () => {
    return exchangeRates[toCurrency]?.toFixed(4) || '0';
  };

  return (
    <div className="min-h-screen bg-converter-gradient p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Currency Converter</h1>
          <p className="text-white/80">Get real-time exchange rates</p>
        </div>

        <Card className="bg-converter-card border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-primary" />
              Convert Currency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* From Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">From</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-converter-input border-0 text-lg font-semibold"
                  />
                </div>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-32 bg-converter-input border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-converter-card">
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={swapCurrencies}
                className="rounded-full bg-swap-button hover:bg-swap-button-hover border-0 text-white transition-all duration-200 hover:scale-110"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* To Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">To</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="bg-converter-input rounded-md px-3 py-2 text-lg font-semibold min-h-[40px] flex items-center">
                    {loading ? (
                      <span className="text-muted-foreground">Converting...</span>
                    ) : (
                      <span className="text-foreground">
                        {getSymbol(toCurrency)} {convertedAmount}
                      </span>
                    )}
                  </div>
                </div>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-32 bg-converter-input border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-converter-card">
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Exchange Rate Info */}
            <div className="text-center text-sm text-muted-foreground bg-accent/50 rounded-lg p-3">
              1 {fromCurrency} = {getRate()} {toCurrency}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrencyConverter;