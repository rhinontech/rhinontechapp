const WHITE_LOGO_B64 = "iVBORw0KGgoAAAANSUhEUgAAAWYAAAFmCAYAAABeJjAWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDEgNzkuYThkNDc1MywgMjAyMy8wMy8yMy0wODo1NjozNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjcgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNC0wNi0yOVQwMTowOToyNCswNTozMCIgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDctMDZUMTk6MjU6NTArMDU6MzAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDctMDZUMTk6MjU6NTArMDU6MzAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmJiZWNiN2ViLTc4YzQtNzY0MC1iYmUzLTczMDRhZTAyMWU3ZiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmZhMDM2ZWUzLWNjNjEtMzc0OC1hNDk5LWVlOWVmNTQyMDZmNSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjliMTg4NDdjLTBjNmUtODI0OS05OTA4LWM3ZDE2NTA4NmU4YyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OWIxODg0N2MtMGM2ZS04MjQ5LTk5MDgtYzdkMTY1MDg2ZThjIiBzdEV2dDp3aGVuPSIyMDI0LTA2LTI5VDAxOjA5OjI0KzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjQuNyAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmJiZWNiN2ViLTc4YzQtNzY0MC1iYmUzLTczMDRhZTAyMWU3ZiIgc3RFdnQ6d2hlbj0iMjAyNC0wNy0wNlQxOToyNTo1MCswNTozMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjcgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtNh5+oAADbCSURBVHic7d13eBRV1wDws9k0EiCBUAKhBEFAEFQQUQQRX/UFFfVVQVDpHelKkfpRpUivAUKLdBCQEhTpRXon1EiHYCgJhNRN9vvDBEPYzc7M7bPn9zx5vveTnXvPzsw9e/buzB2L3W4HhBBC8vAQHQBCCKGnYWJGCCHJYGJGCCHJYGJGCCHJYGJGCCHJYGJGCCHJYGJGuTp8+upjALBfuHwnVXQsCLkLC17HjFzIeYJYhESBkBvBihnphZ/kCDGGiRkZYR8+ddUa0UEgZFY4lYFccXWC4NQGQpRhxYxyo+VTGz/ZEaIMEzOiAZMzQhRhYka0YHJGiBJMzMgZI4kWkzNCFGBiRrRhckaIECZmhBCSDCZm5Ahp1YtVM0IEMDEjVjA5I2QQJmaUE82EiskZIQMwMaMnmvec/ILoGBBCeEs2ehqrkwFv20ZIB6yYURaWn9D46Y+QDpiYESKDHzqIOkzMCIBPcjFzAjPze0MCYGJ2c5G7T5/g1Vf/n5ZN5tUXJ08S8t6j0QdFBoLMBX/8Q7xPADP9EIiP3UJMGKmY7Sz+fl6378LMxX8c3bD9+DmSN4R04f6p/Me+s4d598kRVjmICiMVs/CTr/+4xdNG9f66q+g4FCfyOJqlsnS2D83y/pAgSiZmF3BQaCPsOF648vfF8qFFyovqn4bzl++crlCmaGUn/4znICJixh//HE6VdBowq4nQqOQi9MO1fGiR50X2T0MuSRlA/uIFSc6MFbMe7ljZSHH8Js6PXNmzVYPGouMggA+pRcy4e2J2xLQDau7Knb+1bVT3fdFxZKPqvtY6BlR9f0gwM05lkHpqCqTDgLCmguOhRrKkjBByAitm/VStgmQ9biruTz37UsX3hwTDilm/J9V0mi09WXQwGsmalFWE+xIxh4mZgJen1QeyJeppEb+vERwSYqhx5zHBomNA7gGnMtiS4Wsss+P1VfdJjZZM7rGSpI27cY8vFwr0f45WTIwZ3ZcynAdIIZiY+RExOFkfKwulPlRJXJiYERc4lcFPzpteePTHXPMeEyvx6EcCWJAgbrBilgOLiorHccqKm7Qv2StKd/pWgCSAFbMcnlTSkxZuXkapPdZoJhr8sEcoG0zMkunRov6XkJmkh09bM91AE9yT3OCJK8bz7pMj/NBA3OFUhiJ2HDi3+e2aFRtoeCmv45OzYjbjdAbNfSnj+0OSwopZEW/XrFhfw8vwQ5OSvUcv7aLZ3ojpa6bSbA+ZG1bMihg7e31Yn/YNO7p4mahqGTIy7GkeHhZPmm0KxmJfyvYekaSMVMwWAX9uT6Kk7NCometmkWw/YPzS4bRioQCLDySUEg9jjU9ITgjI6+uvY5Mnybzr4DlfTB3WbtWeI5cO1a5e7lUG4fHi6gOK54F0FovhGFJSbQk+3p75jG5PEcv9iEUG0kSJxHwrNj62eOGAQjo20TUANu44sStPHt/Ad2pWqKIzNF5yfT9n/4o59sJzwS9LEIvqPwDyuFMSIZeUSMygf8DQHgCid5IK1TKA2olZtWu/kYkpcVXG8bM3rojsf9+x6Asi+0fMif7gRegpSiTmgoF+fiL7T0/PSNfz+plLth8Cej9eqlItqwqTMpKOEonZy9MqNM7LN2Pj9bz+uZKFvXP8J7e40iQ1Lf2R6Bh0wqSMpKREYk5KSUsT2X9I0QK6rhbYf/z8aQ0vI07UrftOf9PIdqz0HbN4sOgYdMCkjKSlRGJOs6VnCO0/LV3XVIavt5fVQDe6E/W8Md/uMdCPUS5jmjiw+SQOcdCASRlJjeROLW5ET2UIYsrpDglgUkbSc8eEp1tiUoquqZRUW3oqq1gQEUzKSAlKJGbRUxmpNn1TGRawME8Ax89d/5N1H9mYoXoXfMv6r1NE9o/UokRitumc46XNonNQp6enp7CKJcvLFUu+zroPExFeKffv9HF30TEgdSgxxyxaWppNV8UuPAugLHgokJKMVMzcT3abzhs8aPPy8tS1nzwspkoISk5jbNp5eofoGBAyymjFnD3xKDlw9bDoTLQeHh5CP0gQ2D+o+6LoGBAyjMYcc9aDRJm5cuuu0DvKYu8/fKjn9ddv3tnIKhbkknTfVs5fuXNUdAxILTR//GOWoD0EDzYfL09dN4zorbAlptq3ISn3e4XQotVFx4DUwuKqDPucFTvXMmgXZZowb9N80THQtmVf1B+ETUiZlBEygsnlcu0a1/0ETDRQ0tJsum4wSU+361r0SK83qlWoxrJ9Ed6rVek9gs1Nc64hBMD+OmZTDJi09HSbnten2mz3WcUCAJCals58v/YaGaHKdbeyn2OqTQchCfC4wYR44Fgs7O+ky43eh7zYbGkP2ETyjzt345NYtg8AMGFAMxXuVJM9KSNkCK87/3AAUeTv5+MlOgYJ4DmFTIvnLdmGB5LoEaj3KgsfL69ARqEAAEBwoYCcC/ErLSEx5aae16dnZCSyioUynMZAhvBeK8NQjvXz9RaaiLw8rboq1JQ0WxyjUAAAYPPOYztZtj9q5jqu0xh5/XxK6Hm91cMjD6tYEJKBEosYAYfV2nJll6vwGdD5064s2+/f6ROZf/gT/QVKK7lOGqQUEYlZ98Dyy+ONc6oIQJ2kjBARIRXzrGXblut5vegnmKTZbLoul/P09CzAKhY3plJSxmoZETGS8IhPuo5N3mms5/XeOld3o0305Xomh0kMoRyMJjzDT3Y2wlP4M//0Xcns7elZkFUkbkqlD0b8oEHESBMeyUmozGBLs2XomspACCESNCpR5hWC6NXa9D5aikewDx4mRnPoRhZcv6ERUCFGpAAqUwSbdp7aRaMdZ/L7+/qybN+VxOQUoetBO1Igv1850TEIIHOCljUupCAqifmDulXq0mhHVnrXyvC0egSwiQRlkipBp2dkMF+7BLkXmj+q6R4oR85cO0ixf2YsOt+Z1dOaj00kKAcpkrPVw8NPdAzIXIRe7VC9cqkaIvvXypaenqLn9T5eXiGsYkHPsOw9Gs10Ks1V/wL7RialxC3ZabZ0oQ83tdnSdX1V9fHxLswqlhwwKQDAm9XK1gUx+wL3P2JCicQsms2Wnqzn9Z6eVlxkhy5Ns/wdB4V/yTqQbDApI2aoJua4R0lxNNuTiK6f/zytVpxzpM/lMZg1vM2KyQt/X8o6kFFhG2az7gO5NyUq5vQMu+ipDF3r/1qtVp6X97lD5Zb1Hl0m5+4t3v8q+vrdc6wCOXjqytH+HT7qwKp9hAAoJ+bAfHkCabaXpWhQPqUWBXqhbAl3vMaYF5fJuWzJQi+w6HjV70d+f61KaHUWbSOUnRIVs3j6LmROTtX1UG1iS9bvX8O1QwEePEw8k+3/1XJAqH6T+KzzhGJfvF/9vzTbRMgZTMya6BvjXpxXw/uq4euf8exPhAL5/V7M8Z+4JedGXScF/zKjVwyNthDSAhMzA4H5/X1493k/PvEv3n1KgMeyJJaVU3vc4dAPQk9gYmag4nPBQbz7LBjgV5Z3n5JwlZxJqmZ3+GEVSYhmYtZdvSQmp8ZpeZ2n1WrVHY1ARQrm456YAcxfNc9Y/EeEke3SbOkPdW4i1VocyP0IrZj7jFnSR2T/rPj6ePmL6NfsVXPnr99t7uSfci0KvDytmhaVylyMCBMyEs6TUjuG5vqmDWk5h1L/TFksFqHXUetkAYUeQiARi9UDZ/aQHIjPxGHT106lEUhufH08hVSgWeIfPTohsn/eBvy0YpjoGAzQPdecnGK7DzhtgSRksetdbPhZJA1oHRB6+6A60NoPDGswe0SHTSJjMID0wBqNn/Wxyq19V21lbSv62CCUK9KK2fDg7zJsYTvCvrnxACWfku2OyUdL1eyO+wUphiQxEyWraYNbzCXZnqek5JQromMw4vKNe8dFx4AQ0s9oYlaxgjTMZrM9EB2DEWVKBL1CsLlbHWOEZGJkjpnGgKU5r0ijfVViMMrQMbsdG3+2WOGASoz7YnEuyLTvEdJNxPVBbjFoxodHzhcdQzaG9nmxwgFMVmlDCOVORMVsJEnIUK0aed+yfQgZPXZ63ocMFbORdhGSBu+KmctgmRKx5Wce/Wgg2zwtr0vgEEIEeCZmbhVMt2bvfc2rLw2kSmq9flwywOCm9tS09JtUg0EIOcRrKoM0KfP4Cq4Fj5tpeGD5PqSYyjh54eaRquVDXtXZNkJS4FExi0xIVKvVfceidxFsLlXlbHZVy4fgI6CQslgnZhmqRGoJsdYrZeuSbL9my9FIWrFwZgG8aw4hblhOZcg0jQBANx7VpzT0xC/bNeea29/659nd/3njhbd0to+QcMqscxj3KOkayfaNukwIphULkCVXnNLg5D9vvFBHdAwIGaFSxaynb2eoxTRx/ubwnq3qt5YhFgPcomI22D5CwqmWmPX07wy1uGzpGUmeVg9fGWLRCRMzQhJTMTHricEZWeabAcQkDndKzEb6QEgoZeaYcxB1XbQjMsWCEDIBVRMzgFwJUaZYEEKKUzkxw0/hkQsIm5AmOR88deUIrUAQQmpTOjF/36ZBqxt34i4TNiNFcn6tSmi1kTPWh1OMBWVatfnwFtExIKSH0okZAKBE0cDnMjLsNsJmqCXn0bM3hBnddkDnhq2/H72kP61Y0D++qP/qu6JjQEgPVa/KcETEk1Wckf1KDXe7KsNIPwgJ4yk6AIosQJ4Q7UBnAJPGQisOZzBJISQx5acycqCRcGhNa+CVGgiZg33rn2eTeXZopqmM7HBaQxxZpzKM9IUQwL/nHLfzx2wVcxbiHbj3aPRBGoEAVs4IIZ3MmpgBCBPim9XK1ug9dtkoGWIBTM4IyYDbODTrVEZ2Mk0lyBQLKziVgUxj8+5TSfXrVMm+UBmXc8jMFXMWaarVrfvPkTyaCoZNWzuVViwIIddyJGVu3KFiziJLtSpLHKzIXDEb6Q+5N0fnG/NziFnFvOvIJdnWfpClcpYlDoSQpFhWzAByVieyVFxmnSvFihmZibkq5kwyVneyVKz43ECEFPTb7lNJrPvg8eOfjElEiuTcvPcMfFgofzKej0gh/+XwgyDrqYyn+jK4HUsyfC0Wtj9T09IfentZ81FuX/apDCN9IveU27nG9BziebmcdJXKwImrJxA2oXKSsOeSlAH+eW/SHTOE3IHuxByfkPyAoD+pBvqInp9/d/XW/WjCZoQk5/7jV04k6E9zzAPGryT98JJOmx9mfig6BqS2s9G3M1i2b2QqAxKTUxP9fL3zkPRLsC0LRMm12fcz60T81GkPSRs//7r/t28+fv19ra8/EnXtQvVKpSoY7I7ldIMKUxlG+kXux9W5xuwcMpSYM8kwP0uTDO+HdVLj0Q8mZmQWwhIzyRyzFFc2UCT8/fQc8fNg0jaQNt2GLvhedAxIakLzE0nFnEWGSpMm0e+Hxw087vhoKRp9I/fh8jzrPiSs0eShHVax6JxGYgYQn8xoE/l+eN1ZyWrNE0zMyAyErglE63I54dMAlOGA/Yep90O3YTidgeRE8zpmokE8ataGJbQCocTUSQkBTBnccpzoGJB8rt2+L7xQpDWVkZ3ZFucx8n6kn8pISbWl+nh7ejFoX6WpDCP9I/PTfI7NXbbtatsm74TSDoBFYgbA5Cx9YtbYjzskZiMxIHPjOd4dYnVLNq6cJrmUVFua6BgQQo6xXCvDTMkZKyoTS8/IsImOAUlDitzDdBGjJj2mVSLY3D5x4ZZ11IJByAmrh4dVdAwIZcdqjvmJmcu2b+vUpF49o9vHPUqKC8yXpwDNmAySae6XuB/88e9pZ6JjYiqXDS7Gom2kFN4/9jtukHViBgDYduD8hXdqVniesBnR0wmYmLVRMjFnEn2OKSHNlp7h5WnluWQwL9KsNc9l575Ts0J5Cs3Yo6JjzlJoB8E/g0t0DBKSYn5RcnYvT6tlQviGP0UHIovDp69S/42C56ce8adKpbLBFTsPmd+BRjBITXg1iThDp6xYlvW/e7X56HWRscjk1RdLU/+NgstURg6qPvXDVFMZCYkpyXn9fHwYtM90KmP0nM1/9mtXn3VSwCkNx3IeWzPtJ6nW++GemP++n3CvSMG8BQmbwcRM2I+qidlgH0aYKenQ4Gyfm2U/SZWYuU/gFymYN4h3nwghIqaee49YuydGdAw5mfGXVaSQriN+Jnl2IUumTkY6mH4/NPu0dlHRMeQkYo4ZUtPSU7y9rN4ETeBUBmE/El0ux7MfI8zyVd0IoWsSc0R8Lp08fzOjaoUQaj8CCqmYOw6Z14pk+yFT1q2mFQuSgrRV2aiwjdtFx8Bbz+Hh34HEx4QyKu+zaoUQqrlUSMWcSbWrM0xVMdvSM9I9rR6uTibelSzLh76SUL0i1Cxi7Z7oZp/Wfk7nZirvHymfiKN6Ygbgd1KYKjFr7EfEFAMmZ3GkufONE2nX9jbDj3/u8pXLXch6PGWNixbD72/34YvJNANB5kjMyGRWbj58VMvr/m/qmsWsY8nBdMl5+PTVa4DwfdV59XlX18NLR4bHR+VG5FQGgKTzO07INMXAqx+j7fP8/UDECazqV/ecVBp/tEn9JBzRFbNqB9MUrt6+f0fjS6WuKgAAfpiwSsQVOtLvl9z0GDrve1D8PZBo03tyYdExuCK6YgZQ50dAmSpZ0n54XGts1h8Bn2jRd87IhWPaDRTRNwFW+0qlIkv6fSBDYgagsKNiHyTcK1wgbyEawThhisR8KzY+tnjhAKP7iWdylmmdZldUSEqs948K+yCL9InZyFSGlHMzBQP8AinEYXoESdkIboO1cffpnXn15YAU1Y0TdpA7Pt6U2BdG55ilS859xiybQCsQRBWX5Lxi8rczefSTC/vFq7Fa5+55wIScQ8cfppM+RYkbI1MZ2TdgMehkvcjdFFMZOtun1aeRfkVeEUJK5Nd6Ue9fhakMZaZzSK/KkGEQIB1Onr95l2T7dgPCDU0ZtB00fxxJv4qxA4B9wrzIzTz7AxyPTsm4tGduSCvmJ+1QiMVVHw49fJyckN/fNx/l/h3BijnT3/cT7htZV/vm3/F3Q4oEaN2O1z7kol3/sA/njOqwiU5bsz6YM6rjRhptUSR7xazUwxVoXcdM/Z7zOSt27dPyOk5J2SyoHKfMJ9DobiukCLcfHqVLEnNGddgI2Srbn+ZF/qZlu6FTVy+Gpytiu4RJWXbSfVC7QqtihvXbT15tWK9qKHFE8lK9YpbpEiGWdx0+0bjblMorpnQ7TdoO0kS6D8NslFu7m1piBgD4MWzDxh86fPQRWUjSUjkxMzsxExJTHub18wkwsKmrmGgOdOUqJgXJmpiVXIGQamLOatNgLLLDxOwciysohP1ugQyRcdzzPubSzTFnhwNAIkejrl/R8XJLjj/WeA5mGROHKazcfOiB6BjMRvQiRoixapVKltbyujYDF4SzjkUCloVr9x4UHYTZ/HUt5pToGBxQukBkMZUBYM7qRNWpDK3tPdNWekaGzerhoeUBk6THm8clmFr6RMbINt6Vv8kGK2YEAADvtRxbIud/05iUaXgyfTJ40qq5s5Zso3K9r4Y+kckcPn3VJjoGGrBi1s7sFbOj9gxX2wrBypmcTMffFKsMYsWMsnPHJCVTUkFkTHP+YmI2uYhfD57VuYk7rrmAyVl9pjpnMTGbXLOPX6tkcFNTnegaYHI2oOuwBd+LjgFMeK7iHLN2qs4x621Tl2Ez1q8c3LlhY1btC2C6Qc6Y6LEu0/HCOWakC7PBY7KkDCA+0eSG580/0us8cGZN0TGwgonZTfzx5/lLomNA+h04eSUGHCdjy+/7zt0WEJI0ZozotF90DKxIN5Wx4Jc9h+7HJSSl2my2oAL5g3y9vXy9vKyeAACeVqvV28vTAwAgMTk1LTCfn3eRoHwZ1SqV0nR3GyGVpzKMtK2H2So4Gb4ey7ByYK4+7jC++K9h34n6cJDhGOUk9SJGAGIeCyTTnWKyJma97Wvy3eilY8b3a9qPdruCCB/w8QnJtoC8vl56trlxJy6hRNFAf1YxOSHqA1n4Mcpp56ELqXVrlPeh1R4mZu3Mkpj19qHJ199Nr7h4/LfnabcrgEyDXooP3lyISMwyHZ/sqO4LTMzamSkx6+1HK9WnNGQc9Lr36bYDF2LfqVme9dNiMCk/jer+wB//JDNw8pr1nLpi8eu+zAPHFVlj1x3XOzXLFwb1PyRzkvX4MIGJWTIjuv/vY85dWgDAsiLy8HFK7ak4gGSP2Wh8lk27ooieiu7I0Bmb/qbdpjMte0+vA/IfH+pkm8qA8fO3HLlw+Xb0y5VCX/Xz9fb29/O1+ufxtlosFrvdbn/SrsVisQPY4e6DhKTzf92+PLz7J/WM9qkRrykGzX09epzyKJ+/T37CvohiyIUKFZtqA16WqSsux/bQqavpNaqUVqV4NPUcs8ykS8yU+nJo+IwNkYM6f1SfpI1PO0+qsnZGD+EPQ33rm9Gly5YuNrlezRdeaf7xa6VEx0OiVf+Fv84f1eITI9vei3ucEhTo700hDB7j250+NJ9tDBOzZrImZhr9OUNrcMhyvbWZiKqeMSnnMHjKrxeGdfu4As02Vfma4FZuxz6MFR1DJlqDUNNA6zV6xRKtr0VkyXXQ1A039G70QcepEwn6dGniwq33QMHjTzspA2DFrAfv6QVZqmYAioOlXrOxpbdH9LnGoy83ofy0WSaVjzv1/YIVs3mwPLGpnXjbI/pchcw1n3v/tOZA/XaTW2f+kzuuA02DPTnFlkawvdbLJpkk5Vkrdj8EPO7PwIpZO9krZlr95gYHkNyYVM/DZ21+OKhj/QDCtjX3pyCsmFGumJ7oLfsvWMSyfUSMxiWOzyQZBkkZvx25gIlZUiNnbz5gcFNmJ/yCUS1b/H0/4QGr9hEVpFMbAJnJ+cT5WzagWA3uPXY5FTAha4KJWVID2td/nWBzZid/kYJ5C7JqW0aJyalJDdtNeAWeXqT+qb/LN+9Rv7uOhK+PpydQqJ5fqlBc1wp3znw3bvUlALC/+UoZKu1Jhsn0Ic4xayfi12saCVb2a5yl82Hb8SEb5353y8i267efutywXpVQyiEZZkvPyPC0elhF9L1889HHX9av5ieib44wMQumamJ2qufoFRsn9mv8EUETpknOJ87fvPlShZAStNrbsOPUXx+9XaUMrfYo4DkmTXNeaOCWidlhX+u2nTz/yTtVK1LqgygWJ5RIzFnSbOkpXp5WX4ObKz0II3efudigTuXyDLuQbf/gtch0uVVi1hqUrFUAzbi4newjZkUeGtixwWsGNlV1QHI5f+ITkhMC8vryfrqIK0oVD5Jidv7I+OOfngPtzicFdQM7NqiRmJyaqHe7Rj1mDWIRj1kE5PXNC/JN79mv3LqfrHej3UeiE+Dfy91w/DEiW8VseN1Zg9vpIfLWVa4DYOv+C9f/83p5XauwpWdk2KweYn5kIsA1WcbcfRgXXCg/ixs1aHC2LzD5OucWFTPJCWDqk2f2yj3HePb3n9fLlwSd+9Tq4eHJKByWuJ43wYXyB/LsTye7kz8kgBQVM41q68DJK1dqVg1l+Su40MVeLlyNvVO+dOEitNvVwOxLduKz65ARTM8bKSpmGl+Ba1YNDaUQirTKly5cVFDXMq1yR90XXSdX5t1nx8HzOvLuE6lFeMW889DFy3VrPB+qNwjSfg2QYnnE4+dv3ni5QkgIq/YdmffLvtOtP6tVRedmKlWFWDUjvcxdMVNMynDu8p2btNqS1csVQkp83n1GZ559tv6s1ovthywYpXMzpSpnAXD/KGrJhgOHWfchvGLW2J4eMtyCzGvQ8a66jLwvFSpDIUnyWsyDB6WCCwSK6BsRYX6+CK+YERELAFjaDlo4l1N/Mq4RTYOQD49SwQUKiOgXyQ8TswnMHd6iHThY9azf+NWr128/eYVyd4aS8/LII+cpx2EKU3/euld0DEi7X7efOM6jH5zK0E7GqQwjRD35mkUM1Exfuivq26Zvcb9CI5N0+wM5xWVsC6+Y4xOSH1NsTpaEKPNAs+w8dOEqhXaIntIMAJaPO02qTyEOKr5t+lYlUX23HzCniai+kZyEJ+bMdQTM6Jm7qGIfJCSs3nL84gftxhcXGVjdGuVDw1ftpnE3IdEH0K8ze/wG2aZeugxfuo5CTIa1HxKxTES/s0e2Wy6iX6TPnXuP7vDqS4apDK1taiHLdcyafNR+fMiG2cYWZKfhys17d0NDgoIoNMVkv/efuHb3qJ6f1mbRdi6EfOu6cvNebGhIUCERfSPNuJ0bsiRmre3S7lMPJtMTSzceOtX0wxpVWbStEfH7epyUmuyfxzsPjWCcadZ33pSIMa27suwjG1FTYjJPgSGO54XwqYwsLfvMfNPotr1GLR5HMxaemn5YowqIHZDEJ5t/Hm/fyN1R12gE40zEmNbdwMlTnBlgdTyemtrKucRqVHRMDKN+EaHdRy5F8exPpooZJi/asqV78/fe1bPNgl/2Hmz52Zs1jfSnE4/kKfLHS+L316xP+PSIsW260AjGlZRUW6qPtyezh3vGPUpKDMyXh+bi9k737/34xIcFA/wCXL0OCcV1bEqVmHX2AV/1mPrCkkldzxH2pRWvAaN0cgaO8T9OSk3yz+Nt9JFYWhG9n+jrd2+XLVkoWMtrpy3eca7L12/zfmQa0gYTs6u+dh+59Fed6uXKUuqDKBZGMDlrdO32gwelijG/rZn3gx+QXLiPR2nmmJ145m42ALAISMq8KT3nDBzjL1WsQIHLN+7dZ9yNHQDsPUctHuvqhf0nrJoD/84jI2SI7BWzTIyuS0x6I4YoSlXOl2/cu1emRFBBXv0h9xBz9+GN4EL5S/LuV/aK2QyUvHV5yJS1ayk0wy3+MiWCglJSbWm8+kPuQURSBsCKWQ/SJ3koVzn/vP5A1DcNa75AoSme8eMUAqJJyNjDipkfoso5Yt2fXB/ICgDwTcOalfYciaZxZ6K7/HCKzEXYuYSJmS/DB7rZJ2+8DAD2+ITkhOa9Z9aiF1LualcvG3I95kEcaTtxj5JoLlblCiZnpDScytCO5kNJqVWQV2/djy1dvCCPp2cTx7zytyPnGv23Oo2pEa1wWgMZJTSHYcUsBrWDXrp4wcKQ7TbfX7edOEur7RyIY2703+oV563ec4hGMBqZsUDgrs3AhXMjd0ddFx2HO8HELA6TpPHxOy9VhMwk3X1ExCDKzRPH3Prz2q92GBjekUYwGmFyNqjv+F9+AwBL+IgW7RrUqVQq9kHCPdExcSL8nMGpDO107ajuIxYNmTyw+TDa7RpE+3gQx3zz7/h7IUUCeC5zidMajjm63t7p+dJu4Pwf5oxopfeJ6aoRnr9krJifWWBe558UWnxer5PGl3JZLa1Rl0lFKbZHHHNIkYAg4Hi8Zi7dvp1XX4rKfnetU3NGtPrR1WsUJ8V7kyox9xm79EfRMdBS7YWSmhauycT8ZFg5rUdMp8Hz21Nsktp6KJ2GUI3LoU5N672TlJKW6PqVbsfoh6MUCcyspErMtvQMq+gYBGJ+os8c1iqM8qV2VGKeObRVGGR+42k/cG5jGm06ksfHy//R45RHrNpXmOHkbEvPSKYaiVjSfNhIlZg9Pa1Mn4KhAOYnxqJxnfZSbpJqzLNHtF0OOaanfpy1fimt9vP5++Sn1ZbJGErOnlaPPCBRQjMLqRJzYmISjac3y8TIya7cEzq+7jWV6bXJP3Rs2AQyk/SQKb/MpNAkJhLH7G0GLAw3uK3q+1Sq+KVKzIH58+Ei4f9QKjkvntD13II1ew/Sai83Q7t91hEUW/lOJeEjW7SetXz3CYObWxKTU+NoxsPD8Onr5omOISepEvPjpJQHomNggOTHFUtqWnoqzWCy6ztu+RRabbX8H5fHe2VHJTkv33RoP4V2TKXjl3WqgsH96+frXQAU+9Ab9O0nbUTHkJNUiblgYN5Q0TGwMG+18WrS28vqA5lJumXfsA+Pn7tBY1EhAAAY0/tL2k+d5j0giZPzlx/UeAOefRgD+odyKyIaIGWcUiXm+3EJZptjBgCA1p+/WYNGOwvGdNj0csUSIQBgadEn7EMabQL9a4mVS84OYJL+F2lylnYfdhoU3kh0DM5IlZgLBviXFh0DQ/amPaZSm0NfOLbDJlptHY26foVWW5nMkJyzSJ1cOCHdv1Luv5nD26wSHYMzUiXmB/GPr1BoRpq7/3JaOqnr2fBVu3dSbJLKCV+tUkkWH4hmSs4AmKDtu45cOkOwvWXjjpOHqUVDTupjKVVi9vCwZIiOgbU2X9R5i3KTTJ9ITojryX/+8p0bHLqRekCz9Fb1cpWA4Dz58O2qNUCC/Td+3uaVomNwRarE/DgxidYnKvUkI/MdY33HLZ9KqSmlk3OFMkVDth04f4FDV5Y//jwbxaEfWSk9tfFd6/rM7i6lxm636/3Twki7etrXiiQOlrHRjgviHiUm0Ahs+Iy1K1jE16ZfWH0a8Wnx9/1Hd1m8h5x/kxZu+Z3Xe5JRi37zJtoJ9t+PszdE8I+a/XlB48/IRszf/I9hG9Zp7CdXyzYdOkYai4M/Glz28deNuzcExWbvNGReewN9c49TA+YDqOfIxWP4vR35bN1//rwdzwfqf7KvxyzdHV7pGRk2q4cH6WJLrmJ68r6/7DYpePmUHnd0tE1rOoLL1802/WbXH/l9k4XBhfKzejwW8/exeP2BQ183rPkq634kR7qfefx4qwyp5pgdoLEzqR5wq4eHJ832XFk+pUcM6HsPlsTk1CQKXXO5uiV8dPvNwYXyF4Vs1w4Pm7Z2AcUumK/T/XXDmjXWbj1+kmUfCiCed/7hp+UjqETioG1G7TIje8Wsp09XZIpJc8Wsczstbegl9KS+dC32arlShUvRbHP49HXzB337SWuabWaS9lJNXu7FPb4ZFOhfgrAZ1W96IiZ7xZxFusoZACxzV+6ivYQmAADE3H0Y7+SfdFXONGLR2Sd15UoVLg0All+3nThOq81B337SCnIsLXr5xr2/KDStXAKgLSjQPwTkumpDyWOiSmIGkDA5t230Vm1gcODHztkQlss/u11yBgD4+J2XXgEAS0JiykMW7ZcpEVQGMpP0+HmRhq9zPXb2+jl6USmNRnImPX+VTMoA6kxl6O3fFVbxaY1NS/+u2nK7aY0s3YYv7DFlUIuJHLoy+n6Ff5DJ4uqt+9GlixcsR9iMrOuaM6NSxZxFuso5myc/YK3ZcuyUsxc1/256BQp92bsMXdhTR1w02Ltq75OZKYNaTAJOa1Z3Gbqwh4HtlE4KNJUuXrAs8K+e1d//Bq6xk+V6QRq4Xpu4cefJU1r7btlnVgMtb2DC/N+26oiBJuHXeoav2r2D8nty6NxfMRcNxIeexWPcCz8vafypOJWRnczTGjRoen/LNh481eTD16rSbFOrb76bXvHn8d+ep9mmTrymDXSdJ9djHlwpGVzAzKslkiAac1HRt89WKlvM0UqNMo9lXVRPzADmTs6a31vk7tOXGtR58Xna7epx8Wrs9edL0720TSMpkzPgXHNuaE9JyjqGDVFxjjknmeecSWl+bw3qvFhu2Ix1Wq8mYHISP1+6cEnIdgnaKIpPt0amY4/cdfoAYRuWHP/XNMyQmIHSg0BlTc6aDe78yRe9Ri8Zo/HlzE/m/tmebj1o0urcLgEkMnjyLz8b2MzyxbeTgnVuo/w5IpMGb734Gsh1zbM0TJGYW/7vzZp//Hk2mkJTMg48XSfehH5f9Wnee2YtFm2TGN7j8/YAYJ+5dPs22m2npKRpfojv6Nmb1kLm+141vccdALBcj4mLoR0TAECrPmFvsGjXhGQcd0KZYY75iQETf1kysudnTUnaeJiQnJA/r28+WjFRwvo6Tu4D4+aduNshRQOL02ir+4hFgyYPbD5M48ud7Rea16AbaRf9w5QVsF6mqJizjOz52VcL1/55gqSN/Hl984J8g8nIySriDkHNQooGFgMA+6VrscQP4PX09MxLISQkB9nGnhCmSswAAC0+feNlGqurbdp1+qLRbX9ev/8w5FiLAQDsa7ceN/yh0WHg3C8NbCZ1cgYAyFygyL5++4mjRtsIzO9fhmJISDzmKwLKzlRTGTkQH9hL12LvlCtVWNMPRMeirl95Rd9DTVlXwUb7Ej0gdO+Xuat27Wr7xVt1CPpg+QEmen+qToZcwp3pKuZsiA9ouVKFi4KLgbVw7b79AGDXmZQBAOyPHutekIfH2g2iB4J96NS18/Vs8Ofhsz/q7SNs+c59gJWZCtzyGKlSMT/pc/y8zZu+a13/QyPbEnL0nkQtDuQOlTOAnPFixSxInzFL+o7t+9VY0XHwIHVivh0bH1uscEAhR/+2ZV/UufdqVXpBY1MsEqjIxbxZLtL/RPM+M2stGtuJyZrTOmiNFxOz+xD9rY45aRPz73ujzr3/ZqVcV2G7c+9RXNGgfAU0NkkzObNcnU4rLskZACAhMSU+r59PfoL+SLmMN+5RUkxgvjxFWQaxZV/U0fdqVaquczNMzHSZPikDSDzH7CopAwAUDcoXuO3A+Qsam5R+0fhbsfGxOl5O8n50vYe8fj4BAGDpO275ZII+Des91vWz4ALz5dF7F59uepPylEVb1rCKBZmblBVz9LW7t8uWKqRnoMk4F2lI4y6TgldM4/ZUbKLj1GXYwp7VXizbtPVntWuQtKMRjYcLGHbl5r2/QkOCyurcTOpzTUFuUS0DSJqYNfZB0qfsA4bnPKbop7loJXqumefljcgxt0nM0k5l6DVz6fYdOl4u+wHWO6ANv595q/ccNrqtCzSe2Wa0XxXaRPq41TGQMjGnZ2Sk692mU9N6dXVuIvuB5pKcW39eu/qtv+PvGtlWI8uZS7eJb7sGcddiG2qr+4hF3SjG4O5kH6vUSZmYdx66aPRR8twqTRmFLdv5p5HtihcJCAKGX7srlysW2mHQvI6s2neCxrE13Mbkgc2F/FCKzEHKxPxOzQrlCTY3kpylTNDxCcm39by+Q5O6Wpf7dIZZcg4b3jps485Tp0naiNx9+rjOTSz9f3J9RUdOgyauHA+SnhNuyC2Pg6w//unpi1YM0vxQ03vs8qnj+nxJ8lVY2sXH9xy9dLF2tXIkj7M3HNuJczeiXqpYIrebkmQ4b9HT3DIxS1kxZ5ka8cdvBJurODgsAGAhTMpZ7ZCwD5i0ejZhGw7VrlZO63MJnTF8XF+qWKIS/PsNydEfsU6Dw7+g0Q4C6DZ8UXfRMYgie8Wsp09nRF9mpYXsl6yxiM9wbEeirl2oXqmUyxuQBFGxIJCVW1bLAIwq5h/Grwyn3KQFACy/7406BgCW7sMW9cj6b1Mitu7LbcMZSzRdRidkMB2NunYN2J58NL+a2wHA/tf1u7da9gtrQKFNw7FVr1SqfMs+s2R8bBMmZUp+nL3ByHMcTYNVxQzA99POVUyuYhExoGTaP8TuxT2ODQr0L2JgU8Oxtek3u0H46PabjW5P0+Ok1Dj/PN4BouMwEbetlgHYzjFzS3YarnvOLRauSfnv+wkPgP9JZ4lPSH7MsoOgQP/CYGDt3LY/GH9gafjo9pFTI7ZGGt2elujrd69gUkY0sayYAeSrClmuqayF0Cpg2aZDx5t8UOMlTt1xu0U+zZae4uVp9SVpgwBOX9Dn1tUyAPurMmQ7aXPG4zZJGQCgyQc1Xm7dL+wDTt1x+wD38rT66OyPFtnO79zkdjXKP7/h7DsXJS48lB3zy+XWbj2udVlOXuwAANdj4u5z7FN4Us4yb3SHSOAXD+9vV1weQ7T2j2P7efRDqv/4VXNBx6WA79eqWBkALD/N+30708CQa3a7Xe+fbu0HzPnSQD/M4tqw89RdI+9Dr9FzIjfb2b9vw3+nLty8yvDtZ8f0/HIkzZaepLNfl3/rt584TCs+lvqOW7XcznlMUSR8XMjwx3qOOTvWVZpsFYw0VbIGTPfdmUu3r1YuVyxUy2s7DQr/YubwNitp9h9z99H14EL5ShnZtueIRd0mqrXuhUz3EBih0rhhhmdiBmC702VKzCqeXEz335SIP37r1uzd+jLEYkaTI7Yf7d6snt7HXmnlVr/FyID3LdnuMOBUPbEsbX6YTePGEYe6NXv3v3piYRWHWTFMyllz6szdi398k0c/KhCxVoZdy19Kqi1195FLlwTER0LphBL+Y/vNIMm3mq96Ta/IMA5TadZ3XgTL9j999xUud1kGBfiX4NGPCnhPZRgl9HlvGimdlJ1gsU/N9AgwqUSsP3C4WcOarJ6/yONYmHEMGWKkYsadl0Pb/nObiI6BEUvnIfPbU25T1huUlNesYc1XIfMb56RFW6jeqt6oy4SiNNtDLhi5lOOrnlMq6r4Ihoysl/ZkEX55Deu/gRNWhdHaWRPm//arjr4RoR6jli2x0zkPWBN+nsvyZ2QqAwAAFqzZd7Ll/2pVofw54YzMUxluVdWNnLl+6YBODWl8Q8ApDc5S09IfeXtZ8xM0wew4REXfvlKpbLEyrNpXjeEf/1r+r1bVBw8Tk2gGQ2L/ics0Hvipl1slZQCAAZ0aNgU6C8tjsuXM28uaDzjdHanXxh3Hj4iOQSZEV2UUyO/nRysQUq+/VCaUZ39NekzN7RFF7oLL8xJXRB4y9JBZlCv75Zv3okUHkaV3mwb45JdsaFwux3xgdhsWMZh1H3otm9T1nOgYJGIBAMukhb+v17PRzCXbNmp5XeMGNUgfMoscKBMS9BxIWD0jY5fLOcPsAMc9SkoMzJfHX2QMObjdFIZe67efONqw3kuvaHippn2Zkmp75OPtmZcwLOSc6N9xcExlQzMxA4g/cJiYJbT7yKUzdaqXq+Tkn/FHQHmIfNIPjqlsqN75993oJWNpticpPIF0qlO9XGXInO7IOV98486D82KiQg7gB58kqCbm8f2+6tumX9iHNNvU48YdtmssL9lw8DTL9t1B5nyxBQAsAyesGFaiaIHyWrfdc+QS7n/2uCdnW3pGMu8+ZUd7KgMAAPYcib5Zu3rZ4jTbbNxtUvCKKT3uaHgpft0yN6zq+OD9GDYcW9kwScyZRK2zwOoN4YkjgRsxcZdLBAeGio7DTTw55+MTkm8H5PUNZt0P+gfLxAxAP0liYkYAWDXzkv2cx2qZI9bLfloAwBK5+8wNxv0w9VWvaXgziVyyP0QUsYMfgIJwWY+5QZ3KJWm0M25upMsVs6Yv3raHRl/ZLZnQBW8mkdeTJD1i+rp5ooMxm95jV8wDhgl679HoU6zaVhnrqYwn5q7cfbRtozpabjhwhet0RszdR/HBhfIF0moP8XXo1JXTNaqEVhYdB3IKv/U4wC0xZ6LRGe95ZjxxTGTtH8f2f/ruKzVFx4GewPHlACZmOv0hRe04eOH426+Vf0l0HG4Kx5YTvJ/5R3wg2g2Y+6Wr13QaMr8jaT+Z8MQxubdfK/8yZJunxjlPJAPeFTOAWlUzJmY3l5CYEpvXz6eQ6DjMJu5R0p3AfHlYXRetPBFPycZkh5SR18+nMGRd9TENr/qgBZNy7kQkZgAOyXnWsh0HSbZv1Vfcmh9ITgO7fNIGMpN0i17TK4iOR1WxDxJui45BdiKmMrIz1PnUn7fu7frNf2qzaj8TVvZIswtX/r5QPrTI86LjUASOLRdEVcwAANBlyILvjWzX9Zv/vEk7FoRIlA8tUh7wbkSX8DFh2ghNzNOGthzff/xKZvN2cY+SEo1sd+DkZfyqhUj8s6zp5HXrRAciG3xMmDaipzIAAKBV31kfzB/TUdPz37J83Wt6xcUTvtWyyLqRN4hVD6Lq8Jnr51+tXFLz2tMmheNKI6EVc5b5YzpumrRwyzY921gsHngJE1LGq5VLVgD3nupw1/dtiBQVcw56AmJ1PTOeRIi5DTvPnPqobuUXRcfB2qadpw59ULfKa6LjUIkUFXN2vUYtHke5SUyySEof1a1cBUxeRbf9YXYDTMr6SZeYJ/T/us/gyb8sFtX/jCXbD4nqG7k1CwBYDp2+dlF0IBRZ5v7Y3uVSvehZMk5lZJdrcK36hn04f0yHTaTt5GDa6gWp4/d9Z6Per/WCyg9owHFEQPbEDOA6qdKeZ8YTCkmj5+gVSyb2a9xUdBw64PihQLqpDAeID3TPkYt/ohEIQrxN7Nf4KwCwfNp5qtTJef4ve3cAJmVqVKiYAQDgXtzj5KBAfx8H/6T1ZND6RvHkQrITPmiTU9Ie9xi5qNWsYW1Wio7FjJRJzJkcBYuJGbkr3oMXxwYnKkxlZPfMpUXj5kb+JigWhESzAIBl2s/bd7PuqO0Ps+uz7gP9S7XEnMVy5My1WACA50sXDdGyQcSv+/FJ18iUunxT7y1geD10+4Fzv5z7Y3ssgDhSbSqDlJY3i1/XkBlQGdjzf9mzo9VntevRaAtph4n5WZiYkdkYHeQ4FgRRdSoDIaSdJfvfjKXbt9+PT3wIAJCalp56807c/TOXbl9t1GVScI7XIkGwYn4WnpAIIaGwYkYIIcm4W2LGahghJD13S8wIISQ9TMwIISQZTMwIISQZt0vMX3w7KVh0DAghlBt3u1wuS25vGn8gRAgJ5XYVsytXb99PEh0DQsi9uWvFDIBVM0JIUlgxI4SQZNw5MWNVjBCSkjsnZgAnyXlKxB8neAeCEEJZ3HmOGQAATl+8lfLi88W9HfwTVtQIISHcPjFnInmWIEIIUeXuUxlZMAkjhKSBiflfOZMzfpVACAmBiflpWDkjhITDxPwsTM4IIaEwMTtmGR22fhfgdAZCSAC8KgMhhCSDFTNCCEkGEzNCCEkGEzNCCEkGEzNCCEkGEzNCCEkGEzNCCEnm/wGWygmTd96BcAAAAABJRU5ErkJggg==";

const logoImg = `<img src="data:image/png;base64,${WHITE_LOGO_B64}" alt="Rhinon Tech" width="36" height="36" style="display:block;" />`;

function emailWrapper(headerContent: string, bodyContent: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f4;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo header -->
          <tr>
            <td style="background-color:#1c1917;border-radius:12px 12px 0 0;padding:24px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;padding-right:12px;">${logoImg}</td>
                  <td style="vertical-align:middle;">
                    <span style="font-size:16px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Rhinon Tech</span>
                  </td>
                </tr>
              </table>
              ${headerContent}
            </td>
          </tr>

          <!-- Body card -->
          <tr>
            <td style="background:#ffffff;border-radius:0 0 12px 12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 0 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a8a29e;">
                Rhinon Tech · Hyderabad, Telangana, India
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:#d6d3d1;">
                If you need assistance, please reach out to your HR team.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Welcome / Onboarding ────────────────────────────────────────────────────

interface WelcomeEmailOptions {
  fullName: string;
  companyEmail: string;
  tempPassword: string;
  onboardingUrl: string;
}

export function welcomeEmail({ fullName, companyEmail, tempPassword, onboardingUrl }: WelcomeEmailOptions) {
  const firstName = fullName.split(" ")[0];
  const subject = `Welcome to Rhinon Tech — Set up your account`;

  const header = `
    <p style="margin:16px 0 0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.4px;">
      You've been invited to<br/>Rhinon Tech
    </p>`;

  const body = `
    <p style="margin:0 0 6px;font-size:15px;font-weight:600;color:#1c1917;">Hi ${firstName},</p>
    <p style="margin:0 0 28px;font-size:14px;color:#78716c;line-height:1.7;">
      Your account has been created on the Rhinon Tech Admin Panel. Use the credentials below to get started.
    </p>

    <!-- Credentials card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:10px;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 16px;font-size:11px;font-weight:600;color:#a8a29e;letter-spacing:0.08em;text-transform:uppercase;">Your credentials</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;">
              <span style="font-size:11px;color:#a8a29e;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.06em;">Company Email</span>
              <span style="font-size:14px;font-weight:600;color:#1c1917;">${companyEmail}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0 0;">
              <span style="font-size:11px;color:#a8a29e;display:block;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.06em;">Temporary Password</span>
              <span style="font-size:15px;font-weight:700;color:#1c1917;font-family:'Courier New',monospace;background:#f5f5f4;padding:4px 8px;border-radius:4px;display:inline-block;">${tempPassword}</span>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>

    <p style="margin:0 0 20px;font-size:13px;color:#78716c;line-height:1.7;">
      Click below to set your own password and complete your account setup.<br/>
      <strong style="color:#1c1917;">This link expires in 48 hours.</strong>
    </p>

    <!-- CTA -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="background-color:#1c1917;border-radius:8px;">
          <a href="${onboardingUrl}" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.1px;">
            Set Up Your Account →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:12px;color:#a8a29e;line-height:1.7;">
      If the button doesn't work, copy this link into your browser:<br/>
      <a href="${onboardingUrl}" style="color:#78716c;word-break:break-all;">${onboardingUrl}</a>
    </p>`;

  const html = emailWrapper(header, body);

  const text = `Welcome to Rhinon Tech, ${firstName}!

Your account has been created.

Company Email: ${companyEmail}
Temporary Password: ${tempPassword}

Set up your account: ${onboardingUrl}

This link expires in 48 hours.`;

  return { subject, html, text };
}

// ─── Payslip Paid ────────────────────────────────────────────────────────────

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

interface PayslipPaidEmailOptions {
  fullName: string;
  companyEmail: string;
  netPay: number;
  grossPay: number;
  month: number;
  year: number;
  bankAccountNumber?: string | null;
  payslipUrl: string;
}

export function payslipPaidEmail({ fullName, companyEmail, netPay, grossPay, month, year, bankAccountNumber, payslipUrl }: PayslipPaidEmailOptions) {
  const firstName = fullName.split(" ")[0];
  const period = `${MONTHS[month - 1]} ${year}`;
  const fmt = (n: number) => Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 });
  const maskedAccount = bankAccountNumber ? `••••${bankAccountNumber.slice(-4)}` : null;
  const subject = `Salary Credited — ${period}`;

  const header = `
    <p style="margin:16px 0 0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.4px;">
      Your salary has been<br/>credited
    </p>
    <p style="margin:8px 0 0;font-size:13px;color:#a8a29e;">${period}</p>`;

  const body = `
    <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#1c1917;">Hi ${firstName},</p>
    <p style="margin:0 0 28px;font-size:14px;color:#78716c;line-height:1.7;">
      Your salary for <strong style="color:#1c1917;">${period}</strong> has been processed and will be credited to your bank account within 3–4 hours.
    </p>

    <!-- Amount highlight -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1c1917;border-radius:10px;margin-bottom:20px;">
      <tr><td style="padding:24px;text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;color:#a8a29e;text-transform:uppercase;letter-spacing:0.08em;">Net Pay (Take-Home)</p>
        <p style="margin:0;font-size:32px;font-weight:800;color:#ffffff;letter-spacing:-1px;">₹${fmt(netPay)}</p>
      </td></tr>
    </table>

    <!-- Payment details card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:10px;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 16px;font-size:11px;font-weight:600;color:#a8a29e;letter-spacing:0.08em;text-transform:uppercase;">Payment Details</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;">
              <span style="font-size:13px;color:#78716c;">Gross Pay</span>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;text-align:right;">
              <span style="font-size:13px;font-weight:600;color:#1c1917;">₹${fmt(grossPay)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;">
              <span style="font-size:13px;color:#78716c;">Payment Type</span>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;text-align:right;">
              <span style="font-size:13px;font-weight:600;color:#1c1917;">Salary</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;">
              <span style="font-size:13px;color:#78716c;">Pay Period</span>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;text-align:right;">
              <span style="font-size:13px;font-weight:600;color:#1c1917;">${period}</span>
            </td>
          </tr>
          ${maskedAccount ? `
          <tr>
            <td style="padding:10px 0 0;">
              <span style="font-size:13px;color:#78716c;">Account Number</span>
            </td>
            <td style="padding:10px 0 0;text-align:right;">
              <span style="font-size:13px;font-weight:600;color:#1c1917;">${maskedAccount}</span>
            </td>
          </tr>` : ""}
        </table>
      </td></tr>
    </table>

    <!-- CTA -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="background-color:#1c1917;border-radius:8px;">
          <a href="${payslipUrl}" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.1px;">
            View Payslip →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:12px;color:#a8a29e;line-height:1.7;">
      If you have any questions about your payslip, please contact your HR team.
    </p>`;

  const html = emailWrapper(header, body);

  const text = `Hi ${firstName},

Your salary for ${period} has been processed.

Net Pay: ₹${fmt(netPay)}
Gross Pay: ₹${fmt(grossPay)}
Pay Period: ${period}
${maskedAccount ? `Account: ${maskedAccount}` : ""}

View your payslip: ${payslipUrl}

If you have questions, contact your HR team.`;

  return { subject, html, text };
}
