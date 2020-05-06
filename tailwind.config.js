module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.html', './src/**/*.vue'],
    options: {
      whitelistPatterns: [
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!(|.*?:)cursor-move).+-move$/,
        /^router-link(|-exact)-active$/
      ]
    }
  },
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
};
