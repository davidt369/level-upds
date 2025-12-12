# Banco de Ejercicios de Programación - Level UPDS

Este documento contiene 12 ejercicios de programación diseñados para ser cargados en la plataforma "Level UPDS". Están ordenados por nivel de dificultad.

> **Nota para el Docente:** Todos los ejercicios están configurados para **JavaScript**. Asegúrate de seleccionar ese lenguaje al crear la actividad. Los inputs se leen típicamente simulando argumentos o lectura directa, pero para esta plataforma (Judge0 con Node.js), la solución asume que la entrada viene o se define, o simplemente es una función.
>
> **IMPORTANTE:** Para Judge0 en modo script simple (stdin/stdout), la solución estándar en Node.js lee de `fs.readFileSync(0, 'utf-8')` o `process.stdin`.
> **Para simplificar los ejemplos en este documento**, las soluciones muestran la *lógica* que debe ir dentro. Si la plataforma inyecta variables o llama funciones, adáptalo. Aquí asumiremos el formato estándar de **Leer STDIN -> Imprimir STDOUT**.

---

## Nivel: Básico (1-4)

### 1. Hola Mundo Personalizado
* **Título:** Saludo Personal
* **Puntos:** 50
* **Descripción:** Escribe un programa que lea un nombre de la entrada y muestre "Hola, [nombre]!".
* **Configuración:** JavaScript | 1000ms | 262144KB

**Casos de Prueba:**
| Input | Output Esperado |
|-------|-----------------|
| Juan  | Hola, Juan!     |
| Ana   | Hola, Ana!      |

**Soluciones Posibles:**

**JavaScript (Node.js)**
```javascript
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
console.log(`Hola, ${input}!`);
```

**Python**
```python
import sys
nombre = sys.stdin.read().strip()
print(f"Hola, {nombre}!")
```

**PHP**
```php
<?php
$input = trim(fgets(STDIN));
echo "Hola, $input!";
?>
```

**Java**
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String nombre = scanner.nextLine().trim();
            System.out.println("Hola, " + nombre + "!");
        }
    }
}
```

### 2. Suma de Dos Números
* **Título:** Calculadora Simple
* **Puntos:** 50
* **Descripción:** Lee dos números enteros separados por un espacio y muestra su suma.
* **Configuración:** JavaScript | 1000ms | 262144KB

**Casos de Prueba:**
| Input | Output Esperado |
|-------|-----------------|
| 5 3   | 8               |
| 10 -2 | 8               |
| 0 0   | 0               |

**Soluciones Posibles:**

**JavaScript (Node.js)**
```javascript
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\s+/);
const a = parseInt(input[0]);
const b = parseInt(input[1]);
console.log(a + b);
```

**Python**
```python
import sys
parts = sys.stdin.read().split()
if len(parts) >= 2:
    a = int(parts[0])
    b = int(parts[1])
    print(a + b)
```

**PHP**
```php
<?php
$line = trim(fgets(STDIN));
$parts = preg_split('/\s+/', $line);
echo intval($parts[0]) + intval($parts[1]);
?>
```

**Java**
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int a = scanner.nextInt();
            int b = scanner.nextInt();
            System.out.println(a + b);
        }
    }
}
```

### 3. Área de un Triángulo
* **Título:** Geometría Básica
* **Puntos:** 75
* **Descripción:** Dados la base y la altura de un triángulo (enteros), imprime su área. (Base * Altura / 2).
* **Configuración:** JavaScript | 1000ms | 262144KB

**Casos de Prueba:**
| Input | Output Esperado |
|-------|-----------------|
| 10 5  | 25              |
| 4 3   | 6               |

**Soluciones Posibles:**

**JavaScript (Node.js)**
```javascript
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\s+/);
const base = parseInt(input[0]);
const altura = parseInt(input[1]);
console.log((base * altura) / 2);
```

**Python**
```python
import sys
parts = sys.stdin.read().split()
if len(parts) >= 2:
    base = int(parts[0])
    altura = int(parts[1])
    print((base * altura) / 2)
```

**PHP**
```php
<?php
$line = trim(fgets(STDIN));
$parts = preg_split('/\s+/', $line);
$base = intval($parts[0]);
$altura = intval($parts[1]);
echo ($base * $altura) / 2;
?>
```

**Java**
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int base = scanner.nextInt();
            int altura = scanner.nextInt();
            System.out.println((base * altura) / 2.0);
        }
    }
}
```

### 4. Par o Impar
* **Título:** ¿Es Par?
* **Puntos:** 75
* **Descripción:** Lee un número entero. Si es par imprime "PAR", si es impar imprime "IMPAR".
* **Configuración:** JavaScript | 1000ms | 262144KB

**Casos de Prueba:**
| Input | Output Esperado |
|-------|-----------------|
| 4     | PAR             |
| 7     | IMPAR           |
| 0     | PAR             |

**Soluciones Posibles:**

**JavaScript (Node.js)**
```javascript
const fs = require('fs');
const num = parseInt(fs.readFileSync(0, 'utf-8').trim());
if (num % 2 === 0) {
    console.log("PAR");
} else {
    console.log("IMPAR");
}
```

**Python**
```python
import sys
try:
    num = int(sys.stdin.read().strip())
    if num % 2 == 0:
        print("PAR")
    else:
        print("IMPAR")
except ValueError:
    pass
```

**PHP**
```php
<?php
$num = intval(trim(fgets(STDIN)));
if ($num % 2 == 0) {
    echo "PAR";
} else {
    echo "IMPAR";
}
?>
```

**Java**
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int num = scanner.nextInt();
            if (num % 2 == 0) {
                System.out.println("PAR");
            } else {
                System.out.println("IMPAR");
            }
        }
    }
}
```

---

## Nivel: Intermedio (5-8)

### 5. El Mayor de Tres
* **Título:** Maximizando
* **Puntos:** 100
* **Descripción:** Lee tres números enteros separados por espacios y muestra el mayor de ellos.
* **Configuración:** JavaScript | 1000ms | 262144KB

**Casos de Prueba:**
| Input    | Output Esperado |
|----------|-----------------|
| 1 5 3    | 5               |
| 10 20 5  | 20              |
| -1 -5 -2 | -1              |

**Soluciones Posibles:**

**JavaScript (Node.js)**
```javascript
const fs = require('fs');
const nums = fs.readFileSync(0, 'utf-8').trim().split(/\s+/).map(Number);
console.log(Math.max(...nums));
```

**Python**
```python
import sys
nums = list(map(int, sys.stdin.read().split()))
print(max(nums))
```

**PHP**
```php
<?php
$line = trim(fgets(STDIN));
$nums = array_map('intval', preg_split('/\s+/', $line));
echo max($nums);
?>
```

**Java**
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int max = Integer.MIN_VALUE;
        while(scanner.hasNextInt()){
             int num = scanner.nextInt();
             if(num > max) max = num;
        }
        System.out.println(max);
    }
}
```

### 6. Tabla de Multiplicar
* **Título:** Tablas Matemáticas
* **Puntos:** 100
* **Descripción:** Dado un número N, imprime su tabla de multiplicar del 1 al 10. Cada línea con el formato "N x i = Resultado".
* **Configuración:** JavaScript | 1000ms | 262144KB

**Casos de Prueba:**
| Input | Output Esperado |
|-------|-----------------|
| 2     | 2 x 1 = 2...    |
|       | (hasta 2x10=20) |

**Soluciones Posibles:**

**JavaScript (Node.js)**
```javascript
const fs = require('fs');
const n = parseInt(fs.readFileSync(0, 'utf-8').trim());
for(let i=1; i<=10; i++) {
    console.log(`${n} x ${i} = ${n*i}`);
}
```

**Python**
```python
import sys
try:
    n = int(sys.stdin.read().strip())
    for i in range(1, 11):
        print(f"{n} x {i} = {n*i}")
except ValueError:
    pass
```

**PHP**
```php
<?php
$n = intval(trim(fgets(STDIN)));
for ($i = 1; $i <= 10; $i++) {
    echo "$n x $i = " . ($n * $i) . "\n";
}
?>
```

**Java**
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            for (int i = 1; i <= 10; i++) {
                System.out.println(n + " x " + i + " = " + (n * i));
            }
        }
    }
}
```

### 7. Factorial
* **Título:** Calculando Factoriales
* **Puntos:** 125
* **Descripción:** Calcula el factorial de un número N dado (N!). Ejemplo: 5! = 120.
* **Configuración:** JavaScript | 1000ms | 262144KB

**Casos de Prueba:**
| Input | Output Esperado |
|-------|-----------------|
| 5     | 120             |
| 3     | 6               |
| 0     | 1               |

**Soluciones Posibles:**

**JavaScript (Node.js)**
```javascript
const fs = require('fs');
const n = parseInt(fs.readFileSync(0, 'utf-8').trim());
let fact = 1;
for(let i=1; i<=n; i++) fact *= i;
console.log(fact);
```

**Python**
```python
import sys
try:
    n = int(sys.stdin.read().strip())
    fact = 1
    for i in range(1, n + 1):
        fact *= i
    print(fact)
except ValueError:
    pass
```

**PHP**
```php
<?php
$n = intval(trim(fgets(STDIN)));
$fact = 1;
for ($i = 1; $i <= $n; $i++) {
    $fact *= $i;
}
echo $fact;
?>
```

**Java**
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            long fact = 1;
            for (int i = 1; i <= n; i++) {
                fact *= i;
            }
            System.out.println(fact);
        }
    }
}
```

### 8. Contador de Vocales
* **Título:** Analizando Texo
* **Puntos:** 125
* **Descripción:** Lee una cadena de texto (una palabra) y cuenta cuántas vocales (a,e,i,o,u) contiene. (Ignora mayúsculas/minúsculas o asume minúsculas).
* **Configuración:** JavaScript | 1000ms | 262144KB

**Casos de Prueba:**
| Input | Output Esperado |
|-------|-----------------|
| hola  | 2               |
| avion | 3               |
| xyz   | 0               |

**Soluciones Posibles:**

**JavaScript (Node.js)**
```javascript
const fs = require('fs');
const text = fs.readFileSync(0, 'utf-8').toLowerCase();
const count = (text.match(/[aeiou]/g) || []).length;
console.log(count);
```

**Python**
```python
import sys
text = sys.stdin.read().strip().lower()
vocales = "aeiou"
count = sum(1 for char in text if char in vocales)
print(count)
```

**PHP**
```php
<?php
$text = strtolower(trim(fgets(STDIN)));
echo preg_match_all('/[aeiou]/', $text);
?>
```

**Java**
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String text = scanner.next().toLowerCase();
            int count = 0;
            for (char c : text.toCharArray()) {
                if ("aeiou".indexOf(c) != -1) {
                    count++;
                }
            }
            System.out.println(count);
        }
    }
}
```

---

## Nivel: Avanzado (9-12)

### 9. Palíndromo
* **Título:** Detector de Palíndromos
* **Puntos:** 150
* **Descripción:** Determina si una palabra leída es un palíndromo (se lee igual al revés). Imprime "SI" o "NO".
* **Configuración:** JavaScript | 1000ms | 262144KB

**Casos de Prueba:**
| Input | Output Esperado |
|-------|-----------------|
| radar | SI              |
| casa  | NO              |
| ana   | SI              |

**Soluciones Posibles:**

**JavaScript (Node.js)**
```javascript
const fs = require('fs');
const word = fs.readFileSync(0, 'utf-8').trim();
const reversed = word.split('').reverse().join('');
console.log(word === reversed ? "SI" : "NO");
```

**Python**
```python
import sys
word = sys.stdin.read().strip()
if word == word[::-1]:
    print("SI")
else:
    print("NO")
```

**PHP**
```php
<?php
$word = trim(fgets(STDIN));
if ($word === strrev($word)) {
    echo "SI";
} else {
    echo "NO";
}
?>
```

**Java**
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String word = scanner.next().trim();
            String reversed = new StringBuilder(word).reverse().toString();
            if (word.equals(reversed)) {
                System.out.println("SI");
            } else {
                System.out.println("NO");
            }
        }
    }
}
```

### 10. Invertir Array
* **Título:** Vuelta a los Números
* **Puntos:** 150
* **Descripción:** Lee una lista de números separados por espacios. Imprímelos en orden inverso, separados por espacios.
* **Configuración:** JavaScript | 1000ms | 262144KB

**Casos de Prueba:**
| Input       | Output Esperado |
|-------------|-----------------|
| 1 2 3 4 5   | 5 4 3 2 1       |
| 10 20       | 20 10           |

**Soluciones Posibles:**

**JavaScript (Node.js)**
```javascript
const fs = require('fs');
const nums = fs.readFileSync(0, 'utf-8').trim().split(/\s+/);
console.log(nums.reverse().join(' '));
```

**Python**
```python
import sys
parts = sys.stdin.read().strip().split()
print(" ".join(reversed(parts)))
```

**PHP**
```php
<?php
$line = trim(fgets(STDIN));
$parts = preg_split('/\s+/', $line);
$reversed = array_reverse($parts);
echo implode(" ", $reversed);
?>
```

**Java**
```java
import java.util.Scanner;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<String> list = new ArrayList<>();
        while(scanner.hasNext()) {
            list.add(scanner.next());
        }
        Collections.reverse(list);
        System.out.println(String.join(" ", list));
    }
}
```

### 11. FizzBuzz
* **Título:** Clásico FizzBuzz
* **Puntos:** 200
* **Descripción:** Lee un número N. Imprime los números del 1 al N. Pero para múltiplos de 3 imprime "Fizz", para múltiplos de 5 "Buzz", y para ambos "FizzBuzz".
* **Configuración:** JavaScript | 1000ms | 262144KB

**Casos de Prueba:**
| Input | Output Esperado |
|-------|-----------------|
| 5     | 1\n2\nFizz\n4\nBuzz |

**Soluciones Posibles:**

**JavaScript (Node.js)**
```javascript
const fs = require('fs');
const n = parseInt(fs.readFileSync(0, 'utf-8').trim());
for(let i=1; i<=n; i++) {
    let out = "";
    if(i%3===0) out += "Fizz";
    if(i%5===0) out += "Buzz";
    console.log(out || i);
}
```

**Python**
```python
import sys
try:
    n = int(sys.stdin.read().strip())
    for i in range(1, n + 1):
        out = ""
        if i % 3 == 0: out += "Fizz"
        if i % 5 == 0: out += "Buzz"
        print(out if out else i)
except ValueError:
    pass
```

**PHP**
```php
<?php
$n = intval(trim(fgets(STDIN)));
for ($i = 1; $i <= $n; $i++) {
    $out = "";
    if ($i % 3 === 0) $out .= "Fizz";
    if ($i % 5 === 0) $out .= "Buzz";
    echo ($out ?: $i) . "\n";
}
?>
```

**Java**
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            for (int i = 1; i <= n; i++) {
                String out = "";
                if (i % 3 == 0) out += "Fizz";
                if (i % 5 == 0) out += "Buzz";
                if (out.isEmpty()) System.out.println(i);
                else System.out.println(out);
            }
        }
    }
}
```

### 12. Suma de Primos
* **Título:** Desafío Primo
* **Puntos:** 250
* **Descripción:** Lee un número N. Calcula la suma de todos los números primos menores o iguales a N.
* **Configuración:** JavaScript | 2000ms | 262144KB

**Casos de Prueba:**
| Input | Output Esperado |
|-------|-----------------|
| 5     | 10              | (2+3+5 = 10)
| 10    | 17              | (2+3+5+7 = 17)

**Soluciones Posibles:**

**JavaScript (Node.js)**
```javascript
const fs = require('fs');
const n = parseInt(fs.readFileSync(0, 'utf-8').trim());

function isPrime(num) {
    if(num < 2) return false;
    for(let i=2; i<=Math.sqrt(num); i++) {
        if(num % i === 0) return false;
    }
    return true;
}

let sum = 0;
for(let i=2; i<=n; i++) {
    if(isPrime(i)) sum += i;
}
console.log(sum);
```

**Python**
```python
import sys

def is_prime(num):
    if num < 2: return False
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0: return False
    return True

try:
    n = int(sys.stdin.read().strip())
    total = 0
    for i in range(2, n + 1):
        if is_prime(i):
            total += i
    print(total)
except ValueError:
    pass
```

**PHP**
```php
<?php
function isPrime($num) {
    if ($num < 2) return false;
    for ($i = 2; $i <= sqrt($num); $i++) {
        if ($num % $i === 0) return false;
    }
    return true;
}

$n = intval(trim(fgets(STDIN)));
$sum = 0;
for ($i = 2; $i <= $n; $i++) {
    if (isPrime($i)) $sum += $i;
}
echo $sum;
?>
```

**Java**
```java
import java.util.Scanner;

public class Main {
    public static boolean isPrime(int num) {
        if (num < 2) return false;
        for (int i = 2; i <= Math.sqrt(num); i++) {
            if (num % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            long sum = 0;
            for (int i = 2; i <= n; i++) {
                if (isPrime(i)) sum += i;
            }
            System.out.println(sum);
        }
    }
}
```
