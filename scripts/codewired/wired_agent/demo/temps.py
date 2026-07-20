"""Tiny utility: convert a list of Celsius readings to Fahrenheit."""

def c_to_f(readings):
    out = []
    for c in readings:
        f = c * 9 / 5 + 32
        out.append(round(f, 1))
    return out

if __name__ == "__main__":
    print(c_to_f([0, 100, 37]))   # expect [32.0, 212.0, 98.6]
