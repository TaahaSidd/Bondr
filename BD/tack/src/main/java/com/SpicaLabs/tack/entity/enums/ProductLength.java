package com.SpicaLabs.tack.entity.enums;

public enum ProductLength {

    L5_5(5.5),
    L6(6.0),
    L7(7.0),
    L7_5(7.5),
    L8_5(8.5),
    L9(9.0),
    L9_5(9.5);

    private final double value;

    ProductLength(double value) {
        this.value = value;
    }

    public double getValue() {
        return value;
    }

}
